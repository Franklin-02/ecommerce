"use client";

import { DataTable, type Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Form, SelectField, TextField } from "@/components/ui/form";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCompact, formatShortDate } from "@/lib/format";
import { campaignStatusMeta } from "@/lib/status";
import { bannersCollection } from "@/stores/admin-data";
import { newId } from "@/stores/collection";
import { showToast } from "@/stores/toast";
import type { BannerSlot, CampaignStatus } from "@/types/commerce";
import { AddButton, CampaignStatusField, DateRangeFields, FormActions, ImageField, NameCell, RowActions, useCrud } from "./crud";

const PLACEMENTS: BannerSlot["placement"][] = ["Homepage hero", "Homepage tile", "Homepage promo", "Category header"];
const clickRate = (banner: BannerSlot) => (banner.impressions ? (banner.clicks / banner.impressions) * 100 : 0);

export function BannersView() {
  const banners = bannersCollection.useItems();
  const crud = useCrud<BannerSlot>();

  const save = (values: Record<string, string>) => {
    const patch = {
      title: values.title,
      placement: values.placement as BannerSlot["placement"],
      image: values.image,
      href: values.href,
      startsAt: values.startsAt,
      endsAt: values.endsAt,
      status: values.status as CampaignStatus,
    };
    if (crud.item) {
      bannersCollection.update(crud.item.id, patch);
      showToast(`${patch.title} updated`);
    } else {
      bannersCollection.add({ ...patch, id: newId("bnr"), clicks: 0, impressions: 0 });
      showToast(`${patch.title} created`);
    }
    crud.close();
  };

  const columns: Column<BannerSlot>[] = [
    {
      key: "title",
      header: "Banner",
      sortValue: (banner) => banner.title,
      cell: (banner) => <NameCell image={banner.image} name={banner.title} detail={banner.placement} />,
    },
    {
      key: "dates",
      header: "Runs",
      hideBelow: "lg",
      sortValue: (banner) => banner.startsAt,
      cell: (banner) => <span className="whitespace-nowrap">{formatShortDate(banner.startsAt)} – {formatShortDate(banner.endsAt)}</span>,
    },
    { key: "clicks", header: "Clicks", align: "right", hideBelow: "md", sortValue: (banner) => banner.clicks, cell: (banner) => formatCompact(banner.clicks) },
    { key: "ctr", header: "Click rate", align: "right", sortValue: clickRate, cell: (banner) => (banner.impressions ? `${clickRate(banner).toFixed(1)}%` : "No data") },
    { key: "status", header: "Status", hideBelow: "md", sortValue: (banner) => banner.status, cell: (banner) => <StatusBadge {...campaignStatusMeta[banner.status]} /> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (banner) => <RowActions name={banner.title} onEdit={() => crud.openEdit(banner)} onDelete={() => crud.askDelete(banner)} />,
    },
  ];

  const item = crud.item;

  return (
    <>
      <PageHeader title="Banners" description="Merchandising slots across the storefront." actions={<AddButton label="Create banner" onClick={crud.openNew} />} />
      <DataTable
        rows={banners}
        columns={columns}
        getRowKey={(banner) => banner.id}
        label="Banners"
        searchPlaceholder="Search banners"
        searchText={(banner) => banner.title}
        filters={[
          {
            key: "placement",
            label: "All placements",
            options: PLACEMENTS.map((placement) => ({ value: placement, label: placement })),
            matches: (banner, value) => banner.placement === value,
          },
          {
            key: "status",
            label: "All statuses",
            options: Object.entries(campaignStatusMeta).map(([value, meta]) => ({ value, label: meta.label })),
            matches: (banner, value) => banner.status === value,
          },
        ]}
      />

      <Modal open={crud.isOpen} onClose={crud.close} title={item ? "Edit banner" : "Create banner"} size="lg">
        <Form onValid={save}>
          <TextField name="title" label="Title" required defaultValue={item?.title} full />
          <SelectField name="placement" label="Placement" defaultValue={item?.placement ?? "Homepage hero"}>
            {PLACEMENTS.map((placement) => (
              <option key={placement}>{placement}</option>
            ))}
          </SelectField>
          <ImageField value={item?.image} />
          <TextField
            name="href"
            label="Link"
            required
            pattern="/.*"
            patternMessage="Use a path in this store, starting with /."
            defaultValue={item?.href}
            hint="For example, /category/lighting."
            full
          />
          <DateRangeFields startsAt={item?.startsAt} endsAt={item?.endsAt} />
          <CampaignStatusField value={item?.status} />
          <FormActions label={item ? "Save changes" : "Create banner"} onCancel={crud.close} />
        </Form>
      </Modal>

      <ConfirmDialog
        open={crud.deleting !== null}
        title="Delete this banner?"
        body={`${crud.deleting?.title ?? "This banner"} will be removed.`}
        confirmLabel="Delete banner"
        onClose={crud.cancelDelete}
        onConfirm={() => {
          if (!crud.deleting) return;
          bannersCollection.remove(crud.deleting.id);
          showToast(`${crud.deleting.title} deleted`);
        }}
      />
    </>
  );
}
