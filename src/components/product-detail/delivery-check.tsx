"use client";

import { CheckCircle2, MapPin, Store, Truck, XCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/pricing";

type Result = { pincode: string; place: string; serviceable: boolean; nextDay: boolean };

/** First three PIN digits of the main Tamil Nadu delivery hubs. */
const hubs: Record<string, string> = {
  "600": "Chennai",
  "603": "Chengalpattu",
  "613": "Thanjavur",
  "620": "Tiruchirappalli",
  "625": "Madurai",
  "627": "Tirunelveli",
  "628": "Thoothukudi",
  "629": "Nagercoil",
  "632": "Vellore",
  "635": "Hosur",
  "636": "Salem",
  "638": "Erode",
  "641": "Coimbatore",
};

/** Simulated coverage from fixed PIN rules, so demos are repeatable. PINs from 60 to 64 are Tamil Nadu. */
function checkPincode(pincode: string): Result {
  const inTamilNadu = /^6[0-4]/.test(pincode);
  return {
    pincode,
    place: hubs[pincode.slice(0, 3)] ?? (inTamilNadu ? siteConfig.homeState : ""),
    serviceable: !pincode.startsWith("79"), // A sample out-of-coverage region.
    nextDay: inTamilNadu,
  };
}

export function DeliveryCheck() {
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pincode)) {
      setError("Enter a valid 6-digit PIN code.");
      setResult(null);
      return;
    }
    setError("");
    setResult(checkPincode(pincode));
  };

  const destination = result?.place ? `${result.place} (${result.pincode})` : result?.pincode;

  return (
    <div className="rounded-card border border-line p-4">
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="delivery-pincode" className="flex items-center gap-2 text-sm font-semibold text-ink-950">
          <MapPin className="size-4 text-brand-600" aria-hidden />
          Check delivery to your area
        </label>
        <div className="mt-2.5 flex gap-2">
          <input
            id="delivery-pincode"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="PIN code"
            value={pincode}
            aria-invalid={Boolean(error)}
            aria-describedby="delivery-pincode-message"
            onChange={(event) => {
              setPincode(event.target.value.replace(/\D/g, ""));
              setError("");
            }}
            className="h-10 w-32 rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none aria-invalid:border-deal"
          />
          <Button type="submit" variant="secondary" size="sm" className="h-10">
            Check
          </Button>
        </div>
      </form>
      <div id="delivery-pincode-message" role="status">
        {error && <p className="mt-2 text-[0.8125rem] font-medium text-deal">{error}</p>}
        {result && !result.serviceable && (
          <p className="mt-3 flex items-center gap-2 text-sm text-ink-800">
            <XCircle className="size-4 shrink-0 text-deal" aria-hidden />
            Sorry, we don&apos;t deliver to {result.pincode} yet.
          </p>
        )}
        {result?.serviceable && (
          <ul className="mt-3 space-y-1.5 text-sm text-ink-800">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
              We deliver to {destination}
            </li>
            <li className="flex items-center gap-2">
              <Truck className="size-4 shrink-0 text-ink-500" aria-hidden />
              {result.nextDay
                ? `Next-day delivery if you order by 8pm, free over ${formatPrice(siteConfig.freeDeliveryThreshold)}`
                : "Standard delivery in 3–5 business days"}
            </li>
            {result.nextDay && (
              <li className="flex items-center gap-2">
                <Store className="size-4 shrink-0 text-ink-500" aria-hidden />
                Free store pickup, ready in 2 hours
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
