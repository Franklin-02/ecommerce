"use client";

import Image from "next/image";
import { useState } from "react";
import { DataTable, type Column, type TableFilter } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Form, SelectField, TextAreaField, TextField } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { stockState, stockStateMeta } from "@/lib/status";
import { inventoryCollection } from "@/stores/admin-data";
import { showToast } from "@/stores/toast";
import type { Category } from "@/types/catalog";
import type { InventoryItem, StockState } from "@/types/commerce";

const available = (item: InventoryItem) => item.onHand - item.reserved;

const DISCREPANCY_REASONS = ["Count doesn't match", "Damaged stock", "Item in wrong bin", "Missing item"];

export function InventoryLookup({ categories }: { categories: Category[] }) {
  const items = inventoryCollection.useItems();
  const [flagging, setFlagging] = useState<InventoryItem | null>(null);

  const columns: Column<InventoryItem>[] = [
    {
      key: "product",
      header: "Product",
      sortValue: (item) => item.name,
      cell: (item) => (
        <span className="flex min-w-44 items-center gap-3">
          <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
            <Image src={item.image} alt="" fill sizes="40px" className="object-contain p-1" />
          </span>
          <span className="min-w-0">
            <span className="block font-medium text-ink-950">{item.name}</span>
            <span className="block font-mono text-xs text-ink-500">{item.sku}</span>
          </span>
        </span>
      ),
    },
    { key: "bin", header: "Bin", sortValue: (item) => item.bin, cell: (item) => <span className="font-mono text-xs whitespace-nowrap">{item.bin}</span> },
    { key: "onHand", header: "On hand", align: "right", hideBelow: "md", sortValue: (item) => item.onHand, cell: (item) => item.onHand },
    { key: "reserved", header: "Reserved", align: "right", hideBelow: "lg", sortValue: (item) => item.reserved, cell: (item) => item.reserved },
    { key: "available", header: "Available", align: "right", sortValue: available, cell: available },
    {
      key: "state",
      header: "Stock",
      hideBelow: "md",
      sortValue: (item) => stockState(item),
      cell: (item) => <StatusBadge {...stockStateMeta[stockState(item)]} />,
    },
    {
      key: "flag",
      header: "",
      align: "right",
      cell: (item) => (
        <Button size="sm" variant="ghost" aria-label={`Flag discrepancy for ${item.name}`} onClick={() => setFlagging(item)}>
          Flag
        </Button>
      ),
    },
  ];

  const filters: TableFilter<InventoryItem>[] = [
    {
      key: "category",
      label: "All categories",
      options: categories.map((category) => ({ value: category.id, label: category.shortName })),
      matches: (item, value) => item.categoryId === value,
    },
    {
      key: "stock",
      label: "All stock levels",
      options: (Object.keys(stockStateMeta) as StockState[]).map((state) => ({ value: state, label: stockStateMeta[state].label })),
      matches: (item, value) => stockState(item) === value,
    },
  ];

  return (
    <>
      <PageHeader title="Inventory" description="Read-only stock lookup. Flag anything that doesn't match the shelf." />
      <DataTable
        rows={items}
        columns={columns}
        filters={filters}
        getRowKey={(item) => item.productId}
        label="Inventory"
        searchPlaceholder="Search product, SKU, brand or bin"
        searchText={(item) => `${item.name} ${item.sku} ${item.brandName} ${item.bin}`}
        pageSize={12}
      />

      <Modal
        open={flagging !== null}
        onClose={() => setFlagging(null)}
        title="Flag a stock discrepancy"
        description={flagging ? `${flagging.name}, bin ${flagging.bin}` : undefined}
      >
        {flagging && (
          <Form
            onValid={() => {
              showToast(`Discrepancy flagged for ${flagging.name}`);
              setFlagging(null);
            }}
          >
            <TextField name="counted" label="Counted quantity" type="number" min={0} required defaultValue={flagging.onHand} />
            <SelectField name="reason" label="Reason" required defaultValue="">
              <option value="" disabled>
                Choose a reason
              </option>
              {DISCREPANCY_REASONS.map((reason) => (
                <option key={reason}>{reason}</option>
              ))}
            </SelectField>
            <TextAreaField name="note" label="Note (optional)" maxLength={200} />
            <div className="col-span-full flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setFlagging(null)}>
                Cancel
              </Button>
              <Button type="submit">Send flag</Button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
}
