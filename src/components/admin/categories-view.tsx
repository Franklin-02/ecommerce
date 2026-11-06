"use client";

import { DataTable, type Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { CheckboxField, Form, SelectField, TextAreaField, TextField } from "@/components/ui/form";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { categoriesCollection, productsCollection } from "@/stores/admin-data";
import { newId } from "@/stores/collection";
import { showToast } from "@/stores/toast";
import type { Category, CategoryIcon } from "@/types/catalog";
import { AddButton, FormActions, ImageField, NameCell, RowActions, slugify, useCrud } from "./crud";

const ICONS: CategoryIcon[] = ["smartphone", "accessories", "cable", "battery", "headphones", "speaker", "laptop", "watch", "plug", "lightbulb", "home", "router"];
const TINTS: Category["tint"][] = ["blue", "violet", "teal", "amber", "rose", "slate"];
const capitalize = (value: string) => value[0].toUpperCase() + value.slice(1);

export function CategoriesView() {
  const categories = categoriesCollection.useItems();
  const products = productsCollection.useItems();
  const crud = useCrud<Category>();
  const productCount = (id: string) => products.filter((product) => product.categoryId === id).length;

  const save = (values: Record<string, string>) => {
    const patch = {
      name: values.name,
      shortName: values.shortName,
      description: values.description,
      icon: values.icon as CategoryIcon,
      tint: values.tint as Category["tint"],
      image: values.image,
      featured: values.featured === "on",
    };
    if (crud.item) {
      categoriesCollection.update(crud.item.id, patch);
      showToast(`${patch.name} updated`);
    } else {
      categoriesCollection.add({ ...patch, id: newId("cat"), slug: slugify(patch.name) });
      showToast(`${patch.name} added`);
    }
    crud.close();
  };

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Category",
      sortValue: (category) => category.name,
      cell: (category) => <NameCell image={category.image} name={category.name} detail={`/category/${category.slug}`} />,
    },
    { key: "description", header: "Description", hideBelow: "lg", cell: (category) => <span className="line-clamp-2 max-w-md text-ink-600">{category.description}</span> },
    { key: "products", header: "Products", align: "right", sortValue: (category) => productCount(category.id), cell: (category) => productCount(category.id) },
    {
      key: "featured",
      header: "Homepage",
      hideBelow: "md",
      cell: (category) => <StatusBadge label={category.featured ? "Featured" : "Hidden"} tone={category.featured ? "success" : "neutral"} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (category) => {
        const count = productCount(category.id);
        return (
          <RowActions
            name={category.name}
            onEdit={() => crud.openEdit(category)}
            onDelete={() => crud.askDelete(category)}
            deleteBlocked={count > 0 ? `it still has ${count} products` : undefined}
          />
        );
      },
    },
  ];

  const item = crud.item;

  return (
    <>
      <PageHeader title="Categories" description="Organize the catalog and choose what's featured." actions={<AddButton label="Add category" onClick={crud.openNew} />} />
      <DataTable
        rows={categories}
        columns={columns}
        getRowKey={(category) => category.id}
        label="Categories"
        searchPlaceholder="Search categories"
        searchText={(category) => category.name}
        pageSize={12}
      />

      <Modal open={crud.isOpen} onClose={crud.close} title={item ? "Edit category" : "Add category"} size="lg">
        <Form onValid={save}>
          <TextField name="name" label="Name" required defaultValue={item?.name} />
          <TextField name="shortName" label="Short name" required maxLength={14} defaultValue={item?.shortName} hint="Used on tiles." />
          <TextAreaField name="description" label="Description" required defaultValue={item?.description} />
          <SelectField name="icon" label="Icon" defaultValue={item?.icon ?? "smartphone"}>
            {ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {capitalize(icon)}
              </option>
            ))}
          </SelectField>
          <SelectField name="tint" label="Tile colour" defaultValue={item?.tint ?? "blue"}>
            {TINTS.map((tint) => (
              <option key={tint} value={tint}>
                {capitalize(tint)}
              </option>
            ))}
          </SelectField>
          <ImageField value={item?.image} label="Tile image" full />
          <CheckboxField name="featured" label="Feature on the homepage" defaultChecked={item?.featured ?? true} className="col-span-full mb-4" />
          <FormActions label={item ? "Save changes" : "Add category"} onCancel={crud.close} />
        </Form>
      </Modal>

      <ConfirmDialog
        open={crud.deleting !== null}
        title="Delete this category?"
        body={`${crud.deleting?.name ?? "This category"} will be removed.`}
        confirmLabel="Delete category"
        onClose={crud.cancelDelete}
        onConfirm={() => {
          if (!crud.deleting) return;
          categoriesCollection.remove(crud.deleting.id);
          showToast(`${crud.deleting.name} deleted`);
        }}
      />
    </>
  );
}
