"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form";
import { campaignStatusMeta } from "@/lib/status";
import { productsCollection } from "@/stores/admin-data";

/** Tracks which record a CRUD page is creating, editing or deleting. */
export function useCrud<T>() {
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  return {
    isOpen: editing !== null,
    item: editing === "new" ? null : editing,
    openNew: () => setEditing("new"),
    openEdit: (item: T) => setEditing(item),
    close: () => setEditing(null),
    deleting,
    askDelete: (item: T) => setDeleting(item),
    cancelDelete: () => setDeleting(null),
  };
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      <Plus className="size-4" aria-hidden />
      {label}
    </Button>
  );
}

interface RowActionsProps {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
  /** Explains why the record can't be deleted, and disables the button. */
  deleteBlocked?: string;
}

export function RowActions({ name, onEdit, onDelete, deleteBlocked }: RowActionsProps) {
  const action = "grid size-8 place-items-center rounded-lg text-ink-500";
  return (
    <div className="flex justify-end gap-1">
      <button type="button" aria-label={`Edit ${name}`} onClick={onEdit} className={`${action} hover:bg-surface-sunken hover:text-ink-950`}>
        <Pencil className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        aria-label={deleteBlocked ? `Can't delete ${name}: ${deleteBlocked}` : `Delete ${name}`}
        title={deleteBlocked}
        disabled={Boolean(deleteBlocked)}
        onClick={onDelete}
        className={`${action} hover:bg-deal-soft hover:text-deal disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-ink-500`}
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export function FormActions({ label, onCancel }: { label: string; onCancel: () => void }) {
  return (
    <div className="col-span-full mt-1 flex justify-end gap-2">
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">{label}</Button>
    </div>
  );
}

export function Thumb({ src, size = 40 }: { src: string; size?: number }) {
  const photo = src.endsWith(".jpg");
  return (
    <span className="relative block shrink-0 overflow-hidden rounded-lg bg-surface-muted" style={{ width: size, height: size }}>
      <Image src={src} alt="" fill sizes={`${size}px`} className={photo ? "object-cover" : "object-contain p-1"} />
    </span>
  );
}

export function NameCell({ image, name, detail }: { image?: string; name: ReactNode; detail?: ReactNode }) {
  return (
    <div className="flex min-w-44 items-center gap-3">
      {image && <Thumb src={image} />}
      <div className="min-w-0">
        <p className="font-medium text-ink-950">{name}</p>
        {detail && <p className="text-xs text-ink-500">{detail}</p>}
      </div>
    </div>
  );
}

/** Start and end date fields. The end date can't be set before the start. */
export function DateRangeFields({ startsAt, endsAt }: { startsAt?: string; endsAt?: string }) {
  const [start, setStart] = useState(startsAt ?? "");
  return (
    <>
      <TextField
        name="startsAt"
        label="Start date"
        type="date"
        required
        defaultValue={startsAt}
        onChange={(event) => setStart(event.target.value)}
      />
      <TextField name="endsAt" label="End date" type="date" required defaultValue={endsAt} min={start || undefined} />
    </>
  );
}

export function CampaignStatusField({ value }: { value?: string }) {
  return (
    <SelectField name="status" label="Status" defaultValue={value ?? "scheduled"}>
      {Object.entries(campaignStatusMeta).map(([status, meta]) => (
        <option key={status} value={status}>
          {meta.label}
        </option>
      ))}
    </SelectField>
  );
}

const EDITORIAL_IMAGES = [
  { value: "/images/editorial/audio-studio.jpg", label: "Editorial: audio" },
  { value: "/images/editorial/lighting-pendant.jpg", label: "Editorial: lighting" },
  { value: "/images/editorial/home-office.jpg", label: "Editorial: home office" },
];

/** Picks from images already in the project, since the prototype has no uploads. */
export function ImageField({ value, label = "Image", full }: { value?: string; label?: string; full?: boolean }) {
  const products = productsCollection.useItems();
  return (
    <SelectField name="image" label={label} defaultValue={value} full={full}>
      {EDITORIAL_IMAGES.map((image) => (
        <option key={image.value} value={image.value}>
          {image.label}
        </option>
      ))}
      {products.map((product) => (
        <option key={product.id} value={product.images[0]}>
          {product.name}
        </option>
      ))}
    </SelectField>
  );
}

export const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
