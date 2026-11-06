"use client";

import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckboxField, Form, SelectField, TextField } from "@/components/ui/form";
import { indianStates, siteConfig } from "@/config/site";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { saveAddresses, useAddresses, useSession } from "@/stores/auth";
import { newId } from "@/stores/collection";
import { showToast } from "@/stores/toast";
import type { Address } from "@/types/commerce";
import { PHONE_MESSAGE, PHONE_PATTERN, PIN_MESSAGE, PIN_PATTERN } from "./patterns";

/** Guarantees exactly one default, preferring `preferredId`. */
function withSingleDefault(addresses: Address[], preferredId?: string) {
  const defaultId = preferredId ?? addresses.find((address) => address.isDefault)?.id ?? addresses[0]?.id;
  return addresses.map((address) => ({ ...address, isDefault: address.id === defaultId }));
}

interface AddressFormProps {
  address: Address | null;
  fallbackName: string;
  fallbackPhone: string;
  onCancel: () => void;
  onSave: (address: Address) => void;
}

function AddressForm({ address, fallbackName, fallbackPhone, onCancel, onSave }: AddressFormProps) {
  return (
    <Form
      onValid={(values) =>
        onSave({
          id: address?.id ?? newId("adr"),
          label: values.label,
          fullName: values.fullName,
          phone: values.phone,
          line1: values.line1,
          line2: values.line2 || undefined,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
          isDefault: values.isDefault === "on",
        })
      }
    >
      <TextField name="label" label="Label" required placeholder="Home" defaultValue={address?.label} />
      <TextField name="fullName" label="Full name" autoComplete="name" required defaultValue={address?.fullName ?? fallbackName} />
      <TextField
        name="phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
        required
        full
        pattern={PHONE_PATTERN}
        patternMessage={PHONE_MESSAGE}
        defaultValue={address?.phone ?? fallbackPhone}
      />
      <TextField name="line1" label="Flat, house no., street" autoComplete="address-line1" required full defaultValue={address?.line1} />
      <TextField name="line2" label="Area, landmark (optional)" autoComplete="address-line2" full defaultValue={address?.line2} />
      <TextField name="city" label="City" autoComplete="address-level2" required full defaultValue={address?.city} />
      <SelectField name="state" label="State" autoComplete="address-level1" required defaultValue={address?.state ?? siteConfig.homeState}>
        {indianStates.map((state) => (
          <option key={state}>{state}</option>
        ))}
      </SelectField>
      <TextField
        name="pincode"
        label="PIN code"
        autoComplete="postal-code"
        inputMode="numeric"
        maxLength={6}
        required
        pattern={PIN_PATTERN}
        patternMessage={PIN_MESSAGE}
        defaultValue={address?.pincode}
      />
      <CheckboxField name="isDefault" label="Use as my default address" defaultChecked={address?.isDefault} className="col-span-full mb-4" />
      <div className="col-span-full flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save address</Button>
      </div>
    </Form>
  );
}

export function AddressBook() {
  const session = useSession();
  const addresses = useAddresses();
  // null: closed. "new": adding. An Address: editing it.
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const [deleting, setDeleting] = useState<Address | null>(null);

  const save = (address: Address) => {
    const exists = addresses.some((item) => item.id === address.id);
    const next = exists ? addresses.map((item) => (item.id === address.id ? address : item)) : [...addresses, address];
    saveAddresses(withSingleDefault(next, address.isDefault ? address.id : undefined));
    setEditing(null);
    showToast(exists ? "Address updated" : "Address added");
  };

  const addButton = (
    <Button onClick={() => setEditing("new")}>
      <Plus className="size-4" aria-hidden /> Add address
    </Button>
  );

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Addresses</h1>
          <p className="mt-1 text-sm text-ink-500">Manage where your orders are delivered.</p>
        </div>
        {addresses.length > 0 && addButton}
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-card border border-line">
          <EmptyState icon={MapPin} title="No saved addresses" body="Add one now to speed through checkout." action={addButton} />
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.id} className="flex flex-col rounded-card border border-line p-4">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-ink-950">{address.label}</p>
                {address.isDefault && (
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">Default</span>
                )}
              </div>
              <address className="mt-2 flex-1 text-sm leading-6 text-ink-600 not-italic">
                {address.fullName}
                <br />
                {address.line1}
                {address.line2 && `, ${address.line2}`}
                <br />
                {address.city}, {address.state} – {address.pincode}
                <br />
                {address.phone}
              </address>
              <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-line pt-3">
                <Button variant="ghost" size="sm" aria-label={`Edit ${address.label} address`} onClick={() => setEditing(address)}>
                  <Pencil className="size-3.5" aria-hidden /> Edit
                </Button>
                <Button variant="ghost" size="sm" aria-label={`Delete ${address.label} address`} onClick={() => setDeleting(address)}>
                  <Trash2 className="size-3.5" aria-hidden /> Delete
                </Button>
                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    aria-label={`Set ${address.label} as default address`}
                    onClick={() => {
                      saveAddresses(withSingleDefault(addresses, address.id));
                      showToast("Default address updated");
                    }}
                  >
                    Set as default
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add address" : "Edit address"} size="lg">
        <AddressForm
          address={editing === "new" ? null : editing}
          fallbackName={session?.name ?? ""}
          fallbackPhone={session?.phone ?? ""}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this address?"
        body={deleting ? `${deleting.label}: ${deleting.line1}, ${deleting.city}` : ""}
        confirmLabel="Delete address"
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          saveAddresses(withSingleDefault(addresses.filter((address) => address.id !== deleting?.id)));
          showToast("Address deleted");
        }}
      />
    </>
  );
}
