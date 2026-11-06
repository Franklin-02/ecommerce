"use client";

import { DataTable, type Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { CheckboxField, Form, FormSection, SelectField, TextField } from "@/components/ui/form";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatShortDate } from "@/lib/format";
import { formatPrice } from "@/lib/pricing";
import { campaignStatusMeta } from "@/lib/status";
import { categoriesCollection, promotionsCollection } from "@/stores/admin-data";
import { newId } from "@/stores/collection";
import { showToast } from "@/stores/toast";
import type { CampaignStatus, Promotion } from "@/types/commerce";
import { AddButton, CampaignStatusField, DateRangeFields, FormActions, NameCell, RowActions, useCrud } from "./crud";

const KINDS: Promotion["kind"][] = ["Flash sale", "Seasonal", "Bundle", "Clearance"];
const CATEGORY_FIELD = "category:";

export function PromotionsView() {
  const promotions = promotionsCollection.useItems();
  const categories = categoriesCollection.useItems();
  const crud = useCrud<Promotion>();
  const categoryNames = (ids: string[]) =>
    ids.map((id) => categories.find((category) => category.id === id)?.shortName).filter(Boolean).join(", ");

  const save = (values: Record<string, string>) => {
    const patch = {
      name: values.name,
      kind: values.kind as Promotion["kind"],
      discountLabel: values.discountLabel,
      categoryIds: Object.keys(values).filter((key) => key.startsWith(CATEGORY_FIELD)).map((key) => key.slice(CATEGORY_FIELD.length)),
      startsAt: values.startsAt,
      endsAt: values.endsAt,
      status: values.status as CampaignStatus,
    };
    if (crud.item) {
      promotionsCollection.update(crud.item.id, patch);
      showToast(`${patch.name} updated`);
    } else {
      promotionsCollection.add({ ...patch, id: newId("prm"), revenue: 0 });
      showToast(`${patch.name} created`);
    }
    crud.close();
  };

  const columns: Column<Promotion>[] = [
    {
      key: "name",
      header: "Promotion",
      sortValue: (promotion) => promotion.name,
      cell: (promotion) => <NameCell name={promotion.name} detail={`${promotion.kind} · ${promotion.discountLabel}`} />,
    },
    { key: "categories", header: "Categories", hideBelow: "lg", cell: (promotion) => <span className="text-ink-600">{categoryNames(promotion.categoryIds) || "None"}</span> },
    {
      key: "dates",
      header: "Runs",
      hideBelow: "md",
      sortValue: (promotion) => promotion.startsAt,
      cell: (promotion) => <span className="whitespace-nowrap">{formatShortDate(promotion.startsAt)} – {formatShortDate(promotion.endsAt)}</span>,
    },
    { key: "revenue", header: "Revenue", align: "right", hideBelow: "md", sortValue: (promotion) => promotion.revenue, cell: (promotion) => formatPrice(promotion.revenue) },
    { key: "status", header: "Status", sortValue: (promotion) => promotion.status, cell: (promotion) => <StatusBadge {...campaignStatusMeta[promotion.status]} /> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (promotion) => <RowActions name={promotion.name} onEdit={() => crud.openEdit(promotion)} onDelete={() => crud.askDelete(promotion)} />,
    },
  ];

  const item = crud.item;

  return (
    <>
      <PageHeader title="Promotions" description="Sales and bundles running across the store." actions={<AddButton label="Create promotion" onClick={crud.openNew} />} />
      <DataTable
        rows={promotions}
        columns={columns}
        getRowKey={(promotion) => promotion.id}
        label="Promotions"
        searchPlaceholder="Search promotions"
        searchText={(promotion) => promotion.name}
        filters={[
          {
            key: "status",
            label: "All statuses",
            options: Object.entries(campaignStatusMeta).map(([value, meta]) => ({ value, label: meta.label })),
            matches: (promotion, value) => promotion.status === value,
          },
          {
            key: "kind",
            label: "All types",
            options: KINDS.map((kind) => ({ value: kind, label: kind })),
            matches: (promotion, value) => promotion.kind === value,
          },
        ]}
      />

      <Modal open={crud.isOpen} onClose={crud.close} title={item ? "Edit promotion" : "Create promotion"} size="lg">
        <Form onValid={save}>
          <TextField name="name" label="Name" required defaultValue={item?.name} full />
          <SelectField name="kind" label="Type" defaultValue={item?.kind ?? "Flash sale"}>
            {KINDS.map((kind) => (
              <option key={kind}>{kind}</option>
            ))}
          </SelectField>
          <TextField name="discountLabel" label="Discount label" required defaultValue={item?.discountLabel} hint="For example, Up to 30% off." />
          <DateRangeFields startsAt={item?.startsAt} endsAt={item?.endsAt} />
          <CampaignStatusField value={item?.status} />
          <FormSection legend="Categories">
            <div className="col-span-full mb-4 grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <CheckboxField
                  key={category.id}
                  name={`${CATEGORY_FIELD}${category.id}`}
                  label={category.shortName}
                  defaultChecked={item?.categoryIds.includes(category.id)}
                />
              ))}
            </div>
          </FormSection>
          <FormActions label={item ? "Save changes" : "Create promotion"} onCancel={crud.close} />
        </Form>
      </Modal>

      <ConfirmDialog
        open={crud.deleting !== null}
        title="Delete this promotion?"
        body={`${crud.deleting?.name ?? "This promotion"} will be removed.`}
        confirmLabel="Delete promotion"
        onClose={crud.cancelDelete}
        onConfirm={() => {
          if (!crud.deleting) return;
          promotionsCollection.remove(crud.deleting.id);
          showToast(`${crud.deleting.name} deleted`);
        }}
      />
    </>
  );
}
