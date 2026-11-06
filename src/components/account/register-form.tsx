"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckboxField, Form, TextField } from "@/components/ui/form";
import { useHydrated } from "@/lib/store";
import { landingPath, register, useSession } from "@/stores/auth";
import { NewPasswordFields } from "./password-fields";
import { safeNextPath } from "./patterns";

export function RegisterForm() {
  const router = useRouter();
  const next = safeNextPath(useSearchParams().get("next") ?? undefined);
  const hydrated = useHydrated();
  const session = useSession();

  useEffect(() => {
    if (hydrated && session) router.replace(landingPath(session.role, next));
  }, [hydrated, session, next, router]);

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-ink-950">Create your account</h1>
      <p className="mt-1.5 mb-6 text-sm text-ink-500">Check out faster and keep track of everything you buy.</p>

      <Form onValid={(values) => register(values.name, values.email)}>
        <TextField name="name" label="Full name" autoComplete="name" required full />
        <TextField name="email" label="Email" type="email" autoComplete="email" required full />
        <NewPasswordFields />
        <CheckboxField name="offers" label="Email me new launches and offers" className="col-span-full mb-4" />
        <Button type="submit" size="lg" className="col-span-full w-full">
          Create account
        </Button>
      </Form>

      <p className="mt-5 text-center text-sm text-ink-600">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </>
  );
}
