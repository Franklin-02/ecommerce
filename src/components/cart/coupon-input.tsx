"use client";

import { Loader2, TicketPercent, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { validateCoupon } from "@/services/catalog";
import { applyCoupon, removeCoupon } from "@/stores/coupon";
import type { Coupon } from "@/types/commerce";

interface CouponInputProps {
  applied: Coupon | null;
  /** Why the applied coupon isn't taking effect, if it isn't. */
  issue?: string;
}

export function CouponInput({ applied, issue }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!code.trim()) {
      setError("Enter a coupon code.");
      return;
    }
    setChecking(true);
    const result = await validateCoupon(code);
    setChecking(false);
    if (result.ok) {
      applyCoupon(result.coupon);
      setCode("");
      setError("");
    } else {
      setError(result.message);
    }
  };

  if (applied) {
    return (
      <div>
        <div className="flex items-center gap-2 rounded-xl bg-brand-50 py-2 pr-2 pl-3 text-sm">
          <TicketPercent className="size-4 shrink-0 text-brand-600" aria-hidden />
          <span className="min-w-0 flex-1 truncate">
            <span className="font-mono font-medium text-ink-950">{applied.code}</span>
            <span className="text-ink-600"> · {applied.description}</span>
          </span>
          <button
            type="button"
            aria-label={`Remove coupon ${applied.code}`}
            onClick={removeCoupon}
            className="grid size-7 shrink-0 place-items-center rounded-full text-ink-600 hover:bg-brand-100"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        {issue && <p role="status" className="mt-1.5 text-[0.8125rem] font-medium text-warning">{issue}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="coupon-code" className="text-sm font-medium text-ink-800">
        Coupon code
      </label>
      <div className="mt-1.5 flex gap-2">
        <input
          id="coupon-code"
          value={code}
          autoComplete="off"
          placeholder="WELCOME10"
          aria-invalid={Boolean(error)}
          aria-describedby="coupon-error"
          onChange={(event) => {
            setCode(event.target.value.toUpperCase());
            setError("");
          }}
          className="h-10 min-w-0 flex-1 rounded-xl border border-line-strong bg-surface px-3 font-mono text-sm text-ink-950 placeholder:font-sans placeholder:text-ink-400 focus:border-brand-500 focus:outline-none aria-invalid:border-deal"
        />
        <Button type="submit" variant="secondary" size="sm" className="h-10" disabled={checking}>
          {checking ? <Loader2 className="size-4 animate-spin" aria-label="Checking" /> : "Apply"}
        </Button>
      </div>
      <p id="coupon-error" className="mt-1 min-h-5 text-[0.8125rem] leading-5 font-medium text-deal">
        {error}
      </p>
    </form>
  );
}
