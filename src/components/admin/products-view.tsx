"use client";

import { DataTable, type Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Form, SelectField, TextAreaField, TextField } from "@/components/ui/form";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatPrice } from "@/lib/pricing";
import { stockState, stockStateMeta } from "@/lib/status";
import { brandsCollection, categoriesCollection, inventoryCollection, productsCollection } from "@/stores/admin-data";
import { newId } from "@/stores/collection";
import { showToast } from "@/stores/toast";
import type { Product } from "@/types/catalog";
import { AddButton, FormActions, NameCell, RowActions, slugify, useCrud } from "./crud";

const LOW_STOCK = 10;
const productState = (product: Product) => stockState({ onHand: product.stock, reorderPoint: LOW_STOCK });

export function ProductsView() {
  const products = productsCollection.useItems();
  const categories = categoriesCollection.useItems();
  const brands = brandsCollection.useItems();
  const crud = useCrud<Product>();
  const categoryName = (id: string) => categories.find((category) => category.id === id)?.name ?? "Uncategorized";

  const save = (values: Record<string, string>) => {
    const brand = brands.find((candidate) => candidate.id === values.brandId);
    const category = categories.find((candidate) => candidate.id === values.categoryId);
    if (!brand || !category) return;
    const patch = {
      name: values.name,
      brandId: brand.id,
      brandName: brand.name,
      categoryId: category.id,
      price: Number(values.price),
      compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : undefined,
      stock: Number(values.stock),
      summary: values.summary,
    };
    if (crud.item) {
      productsCollection.update(crud.item.id, patch);
      inventoryCollection.update(crud.item.id, { onHand: patch.stock, name: patch.name, brandName: brand.name, categoryId: category.id });
      showToast(`${patch.name} updated`);
    } else {
      const id = newId("prd");
      const sku = `OHM-${brand.name.slice(0, 3).toUpperCase()}-${id.slice(-4).toUpperCase()}`;
      productsCollection.add({
        ...patch,
        id,
        slug: slugify(patch.name),
        sku,
        rating: 0,
        reviewCount: 0,
        unitsSold: 0,
        tags: ["new"],
        addedAt: new Date().toISOString().slice(0, 10),
        images: [category.image],
        highlights: [],
        specs: {},
        warrantyMonths: 24,
      });
      inventoryCollection.add({
        id,
        productId: id,
        sku,
        name: patch.name,
        image: category.image,
        categoryId: category.id,
        brandName: brand.name,
        onHand: patch.stock,
        reserved: 0,
        reorderPoint: 25,
        incoming: 0,
        bin: "Unassigned",
        costPrice: Math.round(patch.price * 0.6 * 100) / 100,
      });
      showToast(`${patch.name} added`);
    }
    crud.close();
  };

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Product",
      sortValue: (product) => product.name,
      cell: (product) => <NameCell image={product.images[0]} name={product.name} detail={product.sku} />,
    },
    { key: "category", header: "Category", hideBelow: "lg", sortValue: (product) => categoryName(product.categoryId), cell: (product) => categoryName(product.categoryId) },
    { key: "brand", header: "Brand", hideBelow: "lg", sortValue: (product) => product.brandName, cell: (product) => product.brandName },
    { key: "price", header: "Price", align: "right", sortValue: (product) => product.price, cell: (product) => formatPrice(product.price) },
    { key: "stock", header: "Stock", align: "right", hideBelow: "md", sortValue: (product) => product.stock, cell: (product) => product.stock },
    { key: "status", header: "Status", hideBelow: "md", cell: (product) => <StatusBadge {...stockStateMeta[productState(product)]} /> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (product) => <RowActions name={product.name} onEdit={() => crud.openEdit(product)} onDelete={() => crud.askDelete(product)} />,
    },
  ];

  const item = crud.item;

  return (
    <>
      <PageHeader title="Products" description={`${products.length} products in the catalog.`} actions={<AddButton label="Add product" onClick={crud.openNew} />} />
      <DataTable
        rows={products}
        columns={columns}
        getRowKey={(product) => product.id}
        label="Products"
        searchPlaceholder="Search name or SKU"
        searchText={(product) => `${product.name} ${product.sku}`}
        filters={[
          {
            key: "category",
            label: "All categories",
            options: categories.map((category) => ({ value: category.id, label: category.shortName })),
            matches: (product, value) => product.categoryId === value,
          },
          {
            key: "brand",
            label: "All brands",
            options: brands.map((brand) => ({ value: brand.id, label: brand.name })),
            matches: (product, value) => product.brandId === value,
          },
          {
            key: "status",
            label: "All stock states",
            options: Object.entries(stockStateMeta).map(([value, meta]) => ({ value, label: meta.label })),
            matches: (product, value) => productState(product) === value,
          },
        ]}
      />

      <Modal open={crud.isOpen} onClose={crud.close} title={item ? "Edit product" : "Add product"} size="lg">
        <Form onValid={save}>
          <TextField name="name" label="Product name" required minLength={3} defaultValue={item?.name} full />
          <SelectField name="brandId" label="Brand" required defaultValue={item?.brandId ?? ""}>
            <option value="" disabled>
              Choose a brand
            </option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </SelectField>
          <SelectField name="categoryId" label="Category" required defaultValue={item?.categoryId ?? ""}>
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectField>
          <TextField name="price" label="Selling price (₹)" type="number" required min={0.01} step={0.01} defaultValue={item?.price} />
          <TextField name="compareAtPrice" label="M.R.P. (₹)" type="number" min={0.01} step={0.01} defaultValue={item?.compareAtPrice} hint="Leave blank if not discounted." />
          <TextField name="stock" label="Stock" type="number" required min={0} step={1} defaultValue={item?.stock} />
          <TextAreaField name="summary" label="Summary" required defaultValue={item?.summary} />
          <FormActions label={item ? "Save changes" : "Add product"} onCancel={crud.close} />
        </Form>
      </Modal>

      <ConfirmDialog
        open={crud.deleting !== null}
        title="Delete this product?"
        body={`${crud.deleting?.name ?? "This product"} will be removed from the catalog and inventory.`}
        confirmLabel="Delete product"
        onClose={crud.cancelDelete}
        onConfirm={() => {
          if (!crud.deleting) return;
          productsCollection.remove(crud.deleting.id);
          inventoryCollection.remove(crud.deleting.id);
          showToast(`${crud.deleting.name} deleted`);
        }}
      />
    </>
  );
}
