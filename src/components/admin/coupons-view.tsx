"use client";

import { DataTable, type Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Form, SelectField, TextField } from "@/components/ui/form";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatNumber } from "@/lib/format";
import { formatPrice } from "@/lib/pricing";
import { campaignStatusMeta } from "@/lib/status";
import { couponsCollection } from "@/stores/admin-data";
import { newId } from "@/stores/collection";
import { showToast } from "@/stores/toast";
import type { CampaignStatus, Coupon } from "@/types/commerce";
import { AddButton, CampaignStatusField, DateRangeFields, FormActions, RowActions, useCrud } from "./crud";

const discountLabel = (coupon: Coupon) =>
  coupon.type === "percent" ? `${coupon.value}% off` : coupon.type === "fixed" ? `${formatPrice(coupon.value)} off` : "Free delivery";

export function CouponsView() {
  const coupons = couponsCollection.useItems();
  const crud = useCrud<Coupon>();

  const save = (values: Record<string, string>) => {
    const patch = {
      code: values.code.toUpperCase(),
      description: values.description,
      type: values.type as Coupon["type"],
      value: Number(values.value),
      minSpend: Number(values.minSpend),
      usageLimit: Number(values.usageLimit),
      startsAt: values.startsAt,
      endsAt: values.endsAt,
      status: values.status as CampaignStatus,
    };
    if (crud.item) {
      couponsCollection.update(crud.item.id, patch);
      showToast(`${patch.code} updated`);
    } else {
      couponsCollection.add({ ...patch, id: newId("cpn"), usageCount: 0 });
      showToast(`${patch.code} created`);
    }
    crud.close();
  };

  const columns: Column<Coupon>[] = [
    {
      key: "code",
      header: "Code",
      sortValue: (coupon) => coupon.code,
      cell: (coupon) => (
        <div className="min-w-40">
          <p className="font-mono text-[0.8125rem] font-medium text-ink-950">{coupon.code}</p>
          <p className="text-xs text-ink-500">{coupon.description}</p>
        </div>
      ),
    },
    { key: "discount", header: "Discount", hideBelow: "md", cell: (coupon) => <span className="whitespace-nowrap">{discountLabel(coupon)}</span> },
    {
      key: "usage",
      header: "Used",
      align: "right",
      hideBelow: "md",
      sortValue: (coupon) => coupon.usageCount,
      cell: (coupon) => `${formatNumber(coupon.usageCount)} / ${formatNumber(coupon.usageLimit)}`,
    },
    { key: "ends", header: "Ends", hideBelow: "lg", sortValue: (coupon) => coupon.endsAt, cell: (coupon) => <span className="whitespace-nowrap">{formatDate(coupon.endsAt)}</span> },
    { key: "status", header: "Status", sortValue: (coupon) => coupon.status, cell: (coupon) => <StatusBadge {...campaignStatusMeta[coupon.status]} /> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (coupon) => <RowActions name={coupon.code} onEdit={() => crud.openEdit(coupon)} onDelete={() => crud.askDelete(coupon)} />,
    },
  ];

  const item = crud.item;

  return (
    <>
      <PageHeader title="Coupons" description="Discount codes customers enter at checkout." actions={<AddButton label="Create coupon" onClick={crud.openNew} />} />
      <DataTable
        rows={coupons}
        columns={columns}
        getRowKey={(coupon) => coupon.id}
        label="Coupons"
        searchPlaceholder="Search codes"
        searchText={(coupon) => `${coupon.code} ${coupon.description}`}
        filters={[
          {
            key: "status",
            label: "All statuses",
            options: Object.entries(campaignStatusMeta).map(([value, meta]) => ({ value, label: meta.label })),
            matches: (coupon, value) => coupon.status === value,
          },
        ]}
      />

      <Modal open={crud.isOpen} onClose={crud.close} title={item ? "Edit coupon" : "Create coupon"} size="lg">
        <Form onValid={save}>
          <TextField
            name="code"
            label="Code"
            required
            pattern="[A-Za-z0-9]{3,16}"
            patternMessage="Use 3 to 16 letters and numbers, with no spaces."
            defaultValue={item?.code}
            className="font-mono uppercase"
          />
          <TextField name="description" label="Description" required defaultValue={item?.description} />
          <SelectField name="type" label="Discount type" defaultValue={item?.type ?? "percent"}>
            <option value="percent">Percentage</option>
            <option value="fixed">Fixed amount</option>
            <option value="shipping">Free delivery</option>
          </SelectField>
          <TextField name="value" label="Value" type="number" required min={0} step={0.01} defaultValue={item?.value ?? 0} hint="Percent or rupees. Use 0 for free delivery." />
          <TextField name="minSpend" label="Minimum spend (₹)" type="number" required min={0} step={0.01} defaultValue={item?.minSpend ?? 0} />
          <TextField name="usageLimit" label="Usage limit" type="number" required min={1} step={1} defaultValue={item?.usageLimit ?? 1000} />
          <DateRangeFields startsAt={item?.startsAt} endsAt={item?.endsAt} />
          <CampaignStatusField value={item?.status} />
          <FormActions label={item ? "Save changes" : "Create coupon"} onCancel={crud.close} />
        </Form>
      </Modal>

      <ConfirmDialog
        open={crud.deleting !== null}
        title="Delete this coupon?"
        body={`${crud.deleting?.code ?? "This coupon"} will stop working immediately.`}
        confirmLabel="Delete coupon"
        onClose={crud.cancelDelete}
        onConfirm={() => {
          if (!crud.deleting) return;
          couponsCollection.remove(crud.deleting.id);
          showToast(`${crud.deleting.code} deleted`);
        }}
      />
    </>
  );
}
