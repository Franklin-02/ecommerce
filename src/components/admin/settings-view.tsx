"use client";

import { useState, type ReactNode } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { CheckboxField, Form, SelectField, TextField } from "@/components/ui/form";
import { ConfirmDialog } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { createPersistedStore, useStore } from "@/lib/store";
import { deliveryMethods } from "@/lib/status";
import { resetDemoData } from "@/stores/collection";
import { showToast } from "@/stores/toast";

const defaults = {
  storeName: siteConfig.name,
  supportEmail: siteConfig.supportEmail,
  supportPhone: siteConfig.supportPhone,
  currency: siteConfig.currency,
  freeDeliveryThreshold: String(siteConfig.freeDeliveryThreshold),
  standardRate: String(deliveryMethods.standard.price),
  nextDayRate: String(deliveryMethods["next-day"].price),
  gstin: siteConfig.gstin,
  taxRate: "18",
  taxInclusive: true,
  notifyOrders: true,
  notifyLowStock: true,
  notifyReturns: true,
  notifyDigest: false,
};

type Settings = typeof defaults;

const settingsStore = createPersistedStore<Settings>("ohmly.admin.settings.v2", defaults);

function Card({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="grid grid-cols-1 gap-4 rounded-card border border-line bg-surface p-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div>
        <h2 className="text-[0.9375rem] font-semibold text-ink-950">{title}</h2>
        <p className="mt-1 text-sm text-ink-500">{description}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function SaveButton() {
  return (
    <div className="col-span-full flex justify-end">
      <Button type="submit">Save</Button>
    </div>
  );
}

export function SettingsView() {
  const settings = useStore(settingsStore);
  const [confirming, setConfirming] = useState(false);

  const save = (section: string, patch: Partial<Settings>) => {
    settingsStore.set((current) => ({ ...current, ...patch }));
    showToast(`${section} saved`);
  };

  return (
    // Keyed so the uncontrolled fields pick up saved values after hydration.
    <div key={JSON.stringify(settings)}>
      <PageHeader title="Settings" description="Store configuration for this demo." />
      <div className="space-y-3">
        <Card title="Store details" description="Shown to customers across the storefront.">
          <Form onValid={(values) => save("Store details", values)}>
            <TextField name="storeName" label="Store name" required defaultValue={settings.storeName} />
            <SelectField name="currency" label="Currency" defaultValue={settings.currency}>
              <option>INR</option>
            </SelectField>
            <TextField name="supportEmail" label="Support email" type="email" required defaultValue={settings.supportEmail} />
            <TextField name="supportPhone" label="Support phone" type="tel" required defaultValue={settings.supportPhone} />
            <TextField name="gstin" label="GSTIN" required full maxLength={15} pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]" patternMessage="Enter a 15-character GSTIN." defaultValue={settings.gstin} />
            <SaveButton />
          </Form>
        </Card>

        <Card title="Shipping" description="Delivery rates offered at checkout.">
          <Form onValid={(values) => save("Shipping", values)}>
            <TextField name="freeDeliveryThreshold" label="Free delivery over (₹)" type="number" required min={0} defaultValue={settings.freeDeliveryThreshold} full />
            <TextField name="standardRate" label="Standard rate (₹)" type="number" required min={0} step={0.01} defaultValue={settings.standardRate} />
            <TextField name="nextDayRate" label="Next-day rate, Tamil Nadu (₹)" type="number" required min={0} step={0.01} defaultValue={settings.nextDayRate} />
            <SaveButton />
          </Form>
        </Card>

        <Card title="GST" description="Included in selling prices. Split as CGST + SGST within Tamil Nadu, IGST for other states.">
          <Form onValid={(values) => save("GST", { taxRate: values.taxRate, taxInclusive: values.taxInclusive === "on" })}>
            <TextField name="taxRate" label="GST rate (%)" type="number" required min={0} max={30} step={0.01} defaultValue={settings.taxRate} />
            <div />
            <CheckboxField name="taxInclusive" label="Prices include GST" defaultChecked={settings.taxInclusive} className="col-span-full mb-4" />
            <SaveButton />
          </Form>
        </Card>

        <Card title="Notifications" description="Choose what the team is alerted about.">
          <Form
            onValid={(values) =>
              save("Notifications", {
                notifyOrders: values.notifyOrders === "on",
                notifyLowStock: values.notifyLowStock === "on",
                notifyReturns: values.notifyReturns === "on",
                notifyDigest: values.notifyDigest === "on",
              })
            }
          >
            <div className="col-span-full mb-4 grid gap-3">
              <CheckboxField name="notifyOrders" label="New high-value orders" defaultChecked={settings.notifyOrders} />
              <CheckboxField name="notifyLowStock" label="Low-stock alerts" defaultChecked={settings.notifyLowStock} />
              <CheckboxField name="notifyReturns" label="Return requests" defaultChecked={settings.notifyReturns} />
              <CheckboxField name="notifyDigest" label="Weekly performance digest" defaultChecked={settings.notifyDigest} />
            </div>
            <SaveButton />
          </Form>
        </Card>

        <Card title="Demo data" description="Everything changed in this browser is saved locally.">
          <p className="mb-3 text-sm text-ink-600">
            Resetting restores the original products, orders and settings, and clears the cart, wishlist and signed-in customer.
          </p>
          <Button variant="secondary" onClick={() => setConfirming(true)}>
            Reset demo data
          </Button>
        </Card>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Reset all demo data?"
        body="All changes made in this browser will be lost. This can't be undone."
        confirmLabel="Reset demo data"
        onClose={() => setConfirming(false)}
        onConfirm={resetDemoData}
      />
    </div>
  );
}
