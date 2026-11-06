"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Form, SelectField, TextField } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCompactPrice, formatNumber } from "@/lib/format";
import { stockState, stockStateMeta } from "@/lib/status";
import { categoriesCollection, inventoryCollection, productsCollection } from "@/stores/admin-data";
import { showToast } from "@/stores/toast";
import type { InventoryItem } from "@/types/commerce";
import { FormActions, NameCell } from "./crud";

type Row = InventoryItem & { id: string };

export function InventoryView() {
  const items = inventoryCollection.useItems();
  const categories = categoriesCollection.useItems();
  const [adjusting, setAdjusting] = useState<Row | null>(null);

  const low = items.filter((item) => stockState(item) === "low").length;
  const out = items.filter((item) => stockState(item) === "out").length;
  const units = items.reduce((sum, item) => sum + item.onHand, 0);
  const value = items.reduce((sum, item) => sum + item.onHand * item.costPrice, 0);

  const save = (values: Record<string, string>) => {
    if (!adjusting) return;
    const onHand = adjusting.onHand + Number(values.adjustment);
    inventoryCollection.update(adjusting.id, {
      onHand,
      reorderPoint: Number(values.reorderPoint),
      reserved: Math.min(adjusting.reserved, onHand),
    });
    productsCollection.update(adjusting.productId, { stock: onHand });
    showToast(`${adjusting.name} now has ${onHand} on hand`);
    setAdjusting(null);
  };

  const columns: Column<Row>[] = [
    { key: "name", header: "Product", sortValue: (item) => item.name, cell: (item) => <NameCell image={item.image} name={item.name} detail={item.sku} /> },
    { key: "bin", header: "Bin", hideBelow: "lg", sortValue: (item) => item.bin, cell: (item) => <span className="font-mono text-xs">{item.bin}</span> },
    { key: "onHand", header: "On hand", align: "right", sortValue: (item) => item.onHand, cell: (item) => item.onHand },
    { key: "reserved", header: "Reserved", align: "right", hideBelow: "md", sortValue: (item) => item.reserved, cell: (item) => item.reserved },
    { key: "reorder", header: "Reorder at", align: "right", hideBelow: "lg", sortValue: (item) => item.reorderPoint, cell: (item) => item.reorderPoint },
    { key: "incoming", header: "Incoming", align: "right", hideBelow: "lg", sortValue: (item) => item.incoming, cell: (item) => item.incoming || "None" },
    { key: "state", header: "Status", hideBelow: "md", sortValue: (item) => item.onHand - item.reorderPoint, cell: (item) => <StatusBadge {...stockStateMeta[stockState(item)]} /> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (item) => (
        <Button variant="secondary" size="sm" aria-label={`Adjust stock for ${item.name}`} onClick={() => setAdjusting(item)}>
          Adjust
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Inventory" description="Stock levels across the Sriperumbudur warehouse." />
      <div className="mb-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Units on hand" value={formatNumber(units)} hint={`${items.length} SKUs`} />
        <KpiCard label="Stock value at cost" value={formatCompactPrice(value)} hint="All on-hand units" />
        <KpiCard label="Low stock" value={formatNumber(low)} hint="At or below reorder point" />
        <KpiCard label="Out of stock" value={formatNumber(out)} hint="Unavailable to customers" />
      </div>
      <DataTable
        rows={items}
        columns={columns}
        getRowKey={(item) => item.id}
        label="Inventory"
        searchPlaceholder="Search name, SKU or bin"
        searchText={(item) => `${item.name} ${item.sku} ${item.bin}`}
        filters={[
          {
            key: "state",
            label: "All stock states",
            options: [
              { value: "attention", label: "Needs attention" },
              ...Object.entries(stockStateMeta).map(([state, meta]) => ({ value: state, label: meta.label })),
            ],
            matches: (item, state) => (state === "attention" ? stockState(item) !== "in-stock" : stockState(item) === state),
          },
          {
            key: "category",
            label: "All categories",
            options: categories.map((category) => ({ value: category.id, label: category.shortName })),
            matches: (item, category) => item.categoryId === category,
          },
        ]}
      />

      <Modal
        open={adjusting !== null}
        onClose={() => setAdjusting(null)}
        title="Adjust stock"
        description={adjusting ? `${adjusting.name}: ${adjusting.onHand} on hand` : undefined}
      >
        <Form onValid={save}>
          <TextField
            name="adjustment"
            label="Adjustment"
            type="number"
            required
            step={1}
            min={adjusting ? -adjusting.onHand : undefined}
            hint="Use a negative number to remove."
          />
          <TextField name="reorderPoint" label="Reorder point" type="number" required min={0} step={1} defaultValue={adjusting?.reorderPoint} />
          <SelectField name="reason" label="Reason" full defaultValue="Stock count">
            <option>Stock count</option>
            <option>Received shipment</option>
            <option>Damaged</option>
            <option>Customer return</option>
          </SelectField>
          <FormActions label="Save adjustment" onCancel={() => setAdjusting(null)} />
        </Form>
      </Modal>
    </>
  );
}
