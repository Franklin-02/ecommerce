"use client";

import { CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Newsletter() {
  const [error, setError] = useState("");
  const [subscribedAs, setSubscribedAs] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("email") as HTMLInputElement;
    if (!input.validity.valid) {
      setError(input.value ? "Enter a valid email, like name@example.com." : "Enter your email address.");
      input.focus();
      return;
    }
    setError("");
    setSubscribedAs(input.value);
  };

  return (
    <section aria-labelledby="newsletter-title" className="mt-14 mb-14 lg:mt-16 lg:mb-16">
      <Container>
        <div className="grid items-center gap-6 rounded-panel bg-brand-50 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 id="newsletter-title" className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
              Get 10% off your first order
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-600 sm:text-base">
              New launches, members-only offers and buying guides. One email a week, unsubscribe anytime.
            </p>
          </div>
          {subscribedAs ? (
            <p role="status" className="flex items-center gap-3 rounded-2xl bg-surface p-4 text-sm font-medium text-ink-900">
              <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden />
              <span className="min-w-0 break-words">You&apos;re in. Your code is on its way to {subscribedAs}.</span>
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "newsletter-error" : undefined}
                  onChange={() => error && setError("")}
                  className="h-12 min-w-0 flex-1 rounded-full border border-line-strong bg-surface px-5 text-sm text-ink-950 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none aria-invalid:border-deal"
                />
                <Button type="submit" size="lg">
                  Subscribe
                </Button>
              </div>
              {error && (
                <p id="newsletter-error" className="mt-2 pl-5 text-sm font-medium text-deal">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
