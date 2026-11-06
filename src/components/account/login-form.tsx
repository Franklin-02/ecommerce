"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, TextField } from "@/components/ui/form";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/store";
import { authenticate, DEMO_PASSWORD, landingPath, useDemoAccounts, useSession, type DemoAccount } from "@/stores/auth";
import { safeNextPath } from "./patterns";

export function LoginForm() {
  const router = useRouter();
  const next = safeNextPath(useSearchParams().get("next") ?? undefined);
  const hydrated = useHydrated();
  const session = useSession();
  const demoAccounts = useDemoAccounts();
  const [demo, setDemo] = useState<DemoAccount | null>(null);
  // Bumped on every tile click, so re-picking the same account still refills the form.
  const [fillCount, setFillCount] = useState(0);
  const [authError, setAuthError] = useState("");

  // Covers both a fresh sign-in and arriving here already signed in.
  useEffect(() => {
    if (hydrated && session) router.replace(landingPath(session.role, next));
  }, [hydrated, session, next, router]);

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-ink-950">Sign in</h1>
      <p className="mt-1.5 mb-6 text-sm text-ink-500">Customers, employees and the admin all sign in here, and each lands in their own area.</p>

      <div className="mb-6 rounded-xl bg-brand-50 p-4">
        <p className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink-800">
          <Sparkles className="size-3.5 text-brand-600" aria-hidden /> Demo accounts · password {DEMO_PASSWORD}
        </p>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {demoAccounts.map((account) => (
            <button
              key={account.role}
              type="button"
              title={account.name}
              aria-pressed={demo?.role === account.role}
              onClick={() => {
                setDemo(account);
                setFillCount((count) => count + 1);
                setAuthError("");
              }}
              className={cn(
                "min-w-0 rounded-lg border px-2.5 py-2 text-left text-xs transition-colors",
                demo?.role === account.role ? "border-brand-500 bg-surface" : "border-transparent bg-surface/60 hover:bg-surface",
              )}
            >
              <span className="block font-semibold text-ink-950">{account.label}</span>
              <span className="block truncate text-ink-500">{account.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* The key remounts the form so the demo values replace anything typed. */}
      <Form
        key={demo ? `${demo.role}-${fillCount}` : "blank"}
        onSubmitCapture={() => setAuthError("")}
        onValid={(values) => {
          const result = authenticate(values.email, values.password);
          if (!result.ok) setAuthError(result.message);
        }}
      >
        <TextField name="email" label="Email" type="email" autoComplete="email" required full defaultValue={demo?.email} />
        <TextField
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          full
          defaultValue={demo?.password}
        />
        <Link
          href="/forgot-password"
          className="col-span-full -mt-1 justify-self-end text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Forgot password?
        </Link>
        <p role="alert" className="col-span-full mt-1 mb-1 min-h-5 text-[0.8125rem] leading-5 font-medium text-deal">
          {authError}
        </p>
        <Button type="submit" size="lg" className="col-span-full w-full">
          Sign in
        </Button>
      </Form>

      <p className="mt-5 text-center text-sm text-ink-600">
        New customer?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-semibold text-brand-600 hover:text-brand-700">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-ink-500">Employee accounts are created by the admin, under Employees.</p>
    </>
  );
}
