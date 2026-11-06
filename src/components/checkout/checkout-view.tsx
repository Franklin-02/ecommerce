"use client";

import { Info, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CouponInput } from "@/components/cart/coupon-input";
import { PHONE_MESSAGE, PHONE_PATTERN, PIN_MESSAGE, PIN_PATTERN } from "@/components/account/patterns";
import { Button } from "@/components/ui/button";
import { Form, FormSection, SelectField, TextField } from "@/components/ui/form";
import { indianStates, siteConfig } from "@/config/site";
import { buildOrder, computeTotals, deliveryPrice } from "@/lib/checkout";
import { formatPrice } from "@/lib/pricing";
import { deliveryMethods, paymentMethodLabels } from "@/lib/status";
import { useHydrated } from "@/lib/store";
import { useAddresses, useSession } from "@/stores/auth";
import { clearCart, useCart } from "@/stores/cart";
import { removeCoupon, useAppliedCoupon } from "@/stores/coupon";
import { placeOrder } from "@/stores/orders";
import type { CartLine } from "@/types/catalog";
import type { Address, DeliveryMethod, PaymentMethod } from "@/types/commerce";
import { PriceSummary } from "./price-summary";
import { RadioCard } from "./radio-card";

const NEW_ADDRESS = "new";
const PLACE_ORDER_DELAY_MS = 800;
const FORM_ID = "checkout-form";

const STORE_ADDRESS = { line1: "42, Usman Road", line2: "T. Nagar", city: "Chennai", state: siteConfig.homeState, pincode: "600017" };

const BANKS = ["Indian Bank", "Indian Overseas Bank", "City Union Bank", "Karur Vysya Bank", "Tamilnad Mercantile Bank", "State Bank of India", "Canara Bank", "HDFC Bank", "ICICI Bank", "Axis Bank"];

function CheckoutSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]" aria-busy="true" aria-label="Loading checkout">
      <div className="h-[32rem] rounded-card bg-surface-sunken" />
      <div className="h-96 rounded-card bg-surface-sunken" />
    </div>
  );
}

function AddressFields({ address }: { address?: Address }) {
  return (
    <>
      <TextField name="line1" label="Flat, house no., street" required autoComplete="address-line1" defaultValue={address?.line1} full />
      <TextField name="line2" label="Area, landmark (optional)" autoComplete="address-line2" defaultValue={address?.line2} full />
      <TextField name="city" label="City" required autoComplete="address-level2" defaultValue={address?.city} full />
      <SelectField name="state" label="State" required autoComplete="address-level1" defaultValue={address?.state ?? siteConfig.homeState}>
        {indianStates.map((state) => (
          <option key={state}>{state}</option>
        ))}
      </SelectField>
      <TextField
        name="pincode"
        label="PIN code"
        required
        inputMode="numeric"
        maxLength={6}
        autoComplete="postal-code"
        pattern={PIN_PATTERN}
        patternMessage={PIN_MESSAGE}
        defaultValue={address?.pincode}
      />
    </>
  );
}

function DemoNotice({ children }: { children: string }) {
  return (
    <p className="col-span-full mb-3 flex items-start gap-2 rounded-lg bg-warning-soft px-3 py-2 text-[0.8125rem] text-warning">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

function UpiFields() {
  return (
    <>
      <DemoNotice>Demo only. No payment is taken, so please don&apos;t enter a real UPI ID. A test value is filled in for you.</DemoNotice>
      <TextField name="upiId" label="UPI ID" required autoComplete="off" defaultValue="demo@upi" pattern="[a-zA-Z0-9._\-]{2,}@[a-zA-Z]{2,}" patternMessage="Enter a UPI ID, like name@bank." hint="You'd approve the payment in your UPI app." full />
    </>
  );
}

function NetBankingFields() {
  return (
    <>
      <DemoNotice>Demo only. No payment is taken and you won&apos;t be sent to a bank.</DemoNotice>
      <SelectField name="bank" label="Your bank" required defaultValue="" full>
        <option value="" disabled>
          Select your bank
        </option>
        {BANKS.map((bank) => (
          <option key={bank}>{bank}</option>
        ))}
      </SelectField>
    </>
  );
}

function CardFields() {
  return (
    <>
      <DemoNotice>Demo only. No payment is taken, so please don&apos;t enter real card details. Test values are filled in for you.</DemoNotice>
      <TextField name="cardNumber" label="Card number" required autoComplete="off" inputMode="numeric" defaultValue="4242 4242 4242 4242" pattern="[\d ]{15,19}" patternMessage="Enter a 16-digit card number." full />
      <TextField name="cardExpiry" label="Expiry (MM/YY)" required autoComplete="off" defaultValue="12/29" pattern="(0[1-9]|1[0-2])/\d{2}" patternMessage="Use the format MM/YY." />
      <TextField name="cardCvc" label="Security code" required autoComplete="off" inputMode="numeric" defaultValue="123" pattern="\d{3,4}" patternMessage="Enter the 3 or 4 digits on your card." />
    </>
  );
}

function paymentDetails(method: PaymentMethod, emiPerMonth: string) {
  if (method === "upi") return "Google Pay, PhonePe, Paytm or any UPI app";
  if (method === "emi") return `${emiPerMonth}/month for ${siteConfig.emiMonths} months on credit cards`;
  if (method === "cod") return "Pay the delivery partner in cash or by UPI";
  return undefined;
}

function SummaryLine({ line }: { line: CartLine }) {
  return (
    <li className="flex items-center gap-3">
      <span className="relative size-14 shrink-0 rounded-lg bg-surface-muted">
        <Image src={line.image} alt="" fill sizes="56px" className="object-contain p-1" />
        <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-ink-800 text-[0.6875rem] font-semibold text-white">
          {line.quantity}
        </span>
      </span>
      <span className="line-clamp-2 min-w-0 flex-1 text-sm leading-5 text-ink-800">{line.name}</span>
      <span className="text-sm font-medium text-ink-950 tabular-nums">{formatPrice(line.unitPrice * line.quantity)}</span>
    </li>
  );
}

function CheckoutForm() {
  const router = useRouter();
  const session = useSession();
  const addresses = useAddresses();
  const { lines } = useCart();
  const coupon = useAppliedCoupon();
  const placing = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryMethod>("next-day");
  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [deliveryError, setDeliveryError] = useState("");
  const [addressId, setAddressId] = useState(
    () => addresses.find((address) => address.isDefault)?.id ?? addresses[0]?.id ?? NEW_ADDRESS,
  );

  useEffect(() => {
    if (lines.length === 0 && !placing.current) router.replace("/cart");
  }, [lines.length, router]);

  const totals = computeTotals(lines, delivery, coupon);
  const savedAddress = addresses.find((address) => address.id === addressId);
  const pickup = delivery === "pickup";
  const emiPerMonth = formatPrice(Math.ceil(totals.total / siteConfig.emiMonths));
  const availablePayments = (Object.keys(paymentMethodLabels) as PaymentMethod[]).filter(
    (method) => method !== "emi" || totals.total >= siteConfig.emiMinimum,
  );
  const activePayment = availablePayments.includes(payment) ? payment : "upi";

  const submit = (values: Record<string, string>) => {
    if (delivery === "next-day" && values.state !== siteConfig.homeState) {
      setDeliveryError(`Next-day delivery only runs within ${siteConfig.homeState}. Choose standard delivery for ${values.state}.`);
      return;
    }
    placing.current = true;
    setSubmitting(true);

    const order = buildOrder({
      customerId: session?.customerId ?? "guest",
      customerName: values.fullName,
      customerEmail: values.email,
      lines,
      totals,
      delivery,
      payment: activePayment,
      couponCode: totals.couponIssue ? undefined : coupon?.code,
      shippingAddress: {
        label: pickup ? "Store pickup" : savedAddress?.label ?? "Delivery",
        fullName: values.fullName,
        phone: values.phone,
        ...(pickup
          ? STORE_ADDRESS
          : { line1: values.line1, line2: values.line2 || undefined, city: values.city, state: values.state, pincode: values.pincode }),
      },
    });

    setTimeout(() => {
      placeOrder(order);
      clearCart();
      removeCoupon();
      router.push(`/checkout/success?order=${order.id}`);
    }, PLACE_ORDER_DELAY_MS);
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <Form id={FORM_ID} onValid={submit} className="gap-y-6 rounded-card border border-line p-5 sm:p-6">
        <FormSection legend="Your details">
          <TextField name="fullName" label="Full name" required autoComplete="name" defaultValue={session?.name} full />
          <TextField name="email" label="Email" type="email" required autoComplete="email" defaultValue={session?.email} />
          <TextField
            name="phone"
            label="Phone"
            type="tel"
            required
            autoComplete="tel"
            pattern={PHONE_PATTERN}
            patternMessage={PHONE_MESSAGE}
            defaultValue={session?.phone || addresses[0]?.phone}
          />
        </FormSection>

        <fieldset className="col-span-full">
          <legend className="mb-3 text-base font-semibold text-ink-950">Delivery method</legend>
          <div className="space-y-2">
            {(Object.keys(deliveryMethods) as DeliveryMethod[]).map((method) => {
              const price = deliveryPrice(method, totals.subtotal);
              return (
                <RadioCard
                  key={method}
                  name="delivery"
                  value={method}
                  checked={delivery === method}
                  onChange={() => {
                    setDelivery(method);
                    setDeliveryError("");
                  }}
                  title={deliveryMethods[method].label}
                  detail={deliveryMethods[method].detail}
                  aside={price === 0 ? "Free" : formatPrice(price)}
                />
              );
            })}
          </div>
          {deliveryError && (
            <p role="alert" className="mt-2 text-sm font-medium text-deal">
              {deliveryError}
            </p>
          )}
        </fieldset>

        {pickup ? (
          <div className="col-span-full rounded-xl bg-surface-muted p-4 text-sm">
            <p className="font-semibold text-ink-950">Pick up from Ohmly T. Nagar</p>
            <p className="mt-0.5 text-ink-600">
              {STORE_ADDRESS.line1}, {STORE_ADDRESS.line2}, {STORE_ADDRESS.city} – {STORE_ADDRESS.pincode}. Bring your order confirmation and a photo ID.
            </p>
          </div>
        ) : (
          <FormSection legend="Delivery address">
            {addresses.length > 0 && (
              <div className="col-span-full mb-4 space-y-2">
                {addresses.map((address) => (
                  <RadioCard
                    key={address.id}
                    name="savedAddress"
                    value={address.id}
                    checked={addressId === address.id}
                    onChange={() => setAddressId(address.id)}
                    title={address.label}
                    detail={`${address.line1}, ${address.city}, ${address.state} – ${address.pincode}`}
                  />
                ))}
                <RadioCard name="savedAddress" value={NEW_ADDRESS} checked={addressId === NEW_ADDRESS} onChange={() => setAddressId(NEW_ADDRESS)} title="Use a new address" />
              </div>
            )}
            {/* Keyed so the fields refill when another saved address is chosen. */}
            <AddressFields key={addressId} address={savedAddress} />
          </FormSection>
        )}

        <fieldset className="col-span-full">
          <legend className="mb-3 text-base font-semibold text-ink-950">Payment method</legend>
          <div className="space-y-2">
            {availablePayments.map((method) => (
              <RadioCard
                key={method}
                name="payment"
                value={method}
                checked={activePayment === method}
                onChange={() => setPayment(method)}
                title={paymentMethodLabels[method]}
                detail={paymentDetails(method, emiPerMonth)}
              />
            ))}
          </div>
          {(activePayment === "upi" || activePayment === "netbanking" || activePayment === "card" || activePayment === "emi") && (
            <div className="mt-4 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              {activePayment === "upi" && <UpiFields />}
              {activePayment === "netbanking" && <NetBankingFields />}
              {(activePayment === "card" || activePayment === "emi") && <CardFields />}
            </div>
          )}
        </fieldset>
      </Form>

      <aside aria-label="Order summary" className="rounded-card border border-line p-5 lg:sticky lg:top-36">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink-950">Order summary</h2>
        <ul className="mb-4 max-h-64 space-y-3 overflow-y-auto pt-1.5 pr-1.5">
          {lines.map((line) => (
            <SummaryLine key={line.productId} line={line} />
          ))}
        </ul>
        <CouponInput applied={coupon} issue={totals.couponIssue} />
        <div className="mt-3">
          <PriceSummary totals={totals} couponCode={coupon?.code} deliveryLabel={deliveryMethods[delivery].label} />
        </div>
        <Button type="submit" form={FORM_ID} size="lg" className="mt-4 w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Placing order…
            </>
          ) : (
            <>
              <Lock className="size-4" aria-hidden />
              Place order · {formatPrice(totals.total)}
            </>
          )}
        </Button>
        <p className="mt-2 text-center text-xs text-ink-500">This is a prototype. No real order or payment is made.</p>
      </aside>
    </div>
  );
}

export function CheckoutView() {
  const hydrated = useHydrated();
  return hydrated ? <CheckoutForm /> : <CheckoutSkeleton />;
}
