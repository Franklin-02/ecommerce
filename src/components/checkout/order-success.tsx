"use client";

import { CheckCircle2, Mail, PackageCheck, SearchX, Truck } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice } from "@/lib/pricing";
import { deliveryMethods, paymentMethodLabels } from "@/lib/status";
import { useHydrated } from "@/lib/store";
import { useSession } from "@/stores/auth";
import { useOrder } from "@/stores/orders";
import { PriceSummary } from "./price-summary";

export function OrderSuccess() {
  const orderId = useSearchParams().get("order") ?? "";
  const hydrated = useHydrated();
  const order = useOrder(orderId);
  const session = useSession();

  if (!hydrated) {
    return <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-panel bg-surface-sunken" aria-busy="true" aria-label="Loading your order" />;
  }

  if (!order) {
    return (
      <EmptyState
        icon={SearchX}
        title="We couldn't find that order"
        body="It may have been placed in another browser."
        action={<ButtonLink href="/">Back to the homepage</ButtonLink>}
      />
    );
  }

  const pickup = order.deliveryMethod === "pickup";
  const address = order.shippingAddress;
  const steps = [
    { icon: Mail, title: "Confirmation on its way", body: `We're emailing the details to ${order.customerEmail}.` },
    { icon: PackageCheck, title: pickup ? "We'll get it ready" : "We'll pack your order", body: pickup ? "You'll get a message when it's ready to collect." : "Our warehouse team is picking it now." },
    { icon: Truck, title: pickup ? "Collect in store" : "Out for delivery", body: deliveryMethods[order.deliveryMethod].eta },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-8" aria-hidden />
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          Thanks, {order.customerName.split(" ")[0]}. Your order is in.
        </h1>
        <p className="mt-2 text-ink-600">
          Order number <span className="font-mono font-medium text-ink-950">{order.number}</span>
        </p>
      </div>

      <ol className="mt-8 grid gap-3 sm:grid-cols-3">
        {steps.map((step) => (
          <li key={step.title} className="rounded-card border border-line p-4">
            <step.icon className="size-5 text-brand-600" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-ink-950">{step.title}</p>
            <p className="mt-0.5 text-[0.8125rem] leading-5 break-words text-ink-600">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-card border border-line p-5">
        <h2 className="text-lg font-semibold tracking-tight text-ink-950">Order summary</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.lines.map((line) => (
            <li key={line.productId} className="flex items-center gap-3 py-2.5 first:pt-0">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image src={line.image} alt="" fill sizes="56px" className="object-contain p-1" />
              </span>
              <span className="min-w-0 flex-1 text-sm text-ink-800">
                {line.name}
                {line.quantity > 1 && <span className="text-ink-500"> × {line.quantity}</span>}
              </span>
              <span className="text-sm font-medium text-ink-950 tabular-nums">{formatPrice(line.unitPrice * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-line pt-4">
          <PriceSummary totals={{ ...order, couponDiscount: order.discount }} couponCode={order.couponCode} deliveryLabel={deliveryMethods[order.deliveryMethod].label} gstState={address.state} />
        </div>
        <div className="mt-5 grid gap-4 border-t border-line pt-4 text-sm sm:grid-cols-2">
          <div>
            <h3 className="font-semibold text-ink-950">{pickup ? "Pickup location" : "Delivering to"}</h3>
            <p className="mt-1 leading-5 text-ink-600">
              {address.fullName}
              <br />
              {address.line1}
              {address.line2 && `, ${address.line2}`}
              <br />
              {address.city}, {address.state} – {address.pincode}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-ink-950">Payment</h3>
            <p className="mt-1 text-ink-600">{paymentMethodLabels[order.paymentMethod]}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/categories">Continue shopping</ButtonLink>
        {/* Staff can place demo orders too, but only customers have an order history. */}
        {session?.role === "customer" && (
          <ButtonLink href="/account/orders" variant="secondary">
            View my orders
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
