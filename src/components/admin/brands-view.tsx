"use client";

import { DataTable, type Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Form, TextField } from "@/components/ui/form";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { formatPrice } from "@/lib/pricing";
import { brandsCollection, productsCollection } from "@/stores/admin-data";
import { newId } from "@/stores/collection";
import { showToast } from "@/stores/toast";
import type { Brand } from "@/types/catalog";
import { AddButton, FormActions, NameCell, RowActions, slugify, useCrud } from "./crud";

export function BrandsView() {
  const brands = brandsCollection.useItems();
  const products = productsCollection.useItems();
  const crud = useCrud<Brand>();

  const owned = (id: string) => products.filter((product) => product.brandId === id);
  const stockValue = (id: string) => owned(id).reduce((sum, product) => sum + product.price * product.stock, 0);

  const save = (values: Record<string, string>) => {
    if (crud.item) {
      brandsCollection.update(crud.item.id, { name: values.name });
      owned(crud.item.id).forEach((product) => productsCollection.update(product.id, { brandName: values.name }));
      showToast(`${values.name} updated`);
    } else {
      brandsCollection.add({ id: newId("brand"), name: values.name, slug: slugify(values.name) });
      showToast(`${values.name} added`);
    }
    crud.close();
  };

  const columns: Column<Brand>[] = [
    { key: "name", header: "Brand", sortValue: (brand) => brand.name, cell: (brand) => <NameCell name={brand.name} detail={brand.slug} /> },
    { key: "products", header: "Products", align: "right", sortValue: (brand) => owned(brand.id).length, cell: (brand) => owned(brand.id).length },
    { key: "value", header: "Stock value", align: "right", hideBelow: "md", sortValue: (brand) => stockValue(brand.id), cell: (brand) => formatPrice(Math.round(stockValue(brand.id))) },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (brand) => {
        const count = owned(brand.id).length;
        return (
          <RowActions
            name={brand.name}
            onEdit={() => crud.openEdit(brand)}
            onDelete={() => crud.askDelete(brand)}
            deleteBlocked={count > 0 ? `it still has ${count} products` : undefined}
          />
        );
      },
    },
  ];

  return (
    <>
      <PageHeader title="Brands" description={`${brands.length} brands in the catalog.`} actions={<AddButton label="Add brand" onClick={crud.openNew} />} />
      <DataTable
        rows={brands}
        columns={columns}
        getRowKey={(brand) => brand.id}
        label="Brands"
        searchPlaceholder="Search brands"
        searchText={(brand) => brand.name}
        pageSize={12}
      />

      <Modal open={crud.isOpen} onClose={crud.close} title={crud.item ? "Edit brand" : "Add brand"}>
        <Form onValid={save}>
          <TextField name="name" label="Brand name" required full defaultValue={crud.item?.name} />
          <FormActions label={crud.item ? "Save changes" : "Add brand"} onCancel={crud.close} />
        </Form>
      </Modal>

      <ConfirmDialog
        open={crud.deleting !== null}
        title="Delete this brand?"
        body={`${crud.deleting?.name ?? "This brand"} will be removed.`}
        confirmLabel="Delete brand"
        onClose={crud.cancelDelete}
        onConfirm={() => {
          if (!crud.deleting) return;
          brandsCollection.remove(crud.deleting.id);
          showToast(`${crud.deleting.name} deleted`);
        }}
      />
    </>
  );
}
