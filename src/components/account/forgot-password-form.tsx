"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Form, TextField } from "@/components/ui/form";

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState("");

  if (sentTo) {
    return (
      <div role="status">
        <span className="mb-4 grid size-14 place-items-center rounded-full bg-success-soft text-success">
          <MailCheck className="size-6" aria-hidden />
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-950">Check your email</h1>
        <p className="mt-2 text-sm leading-6 text-ink-600">
          If an account exists for <span className="font-medium break-words text-ink-950">{sentTo}</span>, a reset link is on its way. It works for 30 minutes.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <ButtonLink href="/login">Back to sign in</ButtonLink>
          <Button variant="secondary" onClick={() => setSentTo("")}>
            Use a different email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-ink-950">Reset your password</h1>
      <p className="mt-1.5 mb-6 text-sm text-ink-500">Enter your email and we&apos;ll send you a reset link.</p>
      <Form onValid={(values) => setSentTo(values.email)}>
        <TextField name="email" label="Email" type="email" autoComplete="email" required full />
        <Button type="submit" size="lg" className="col-span-full w-full">
          Send reset link
        </Button>
      </Form>
      <p className="mt-5 text-center text-sm text-ink-600">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
