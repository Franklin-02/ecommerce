"use client";

import type { FormEvent } from "react";
import { TextField } from "@/components/ui/form";

/** A new password plus its confirmation. Must sit inside a <Form>. */
export function NewPasswordFields({ label = "Password" }: { label?: string }) {
  const syncMatch = (event: FormEvent<HTMLInputElement>) => {
    const elements = event.currentTarget.form?.elements;
    const password = elements?.namedItem("password") as HTMLInputElement | null;
    const confirm = elements?.namedItem("confirmPassword") as HTMLInputElement | null;
    if (!password || !confirm) return;
    confirm.setCustomValidity(confirm.value && password.value !== confirm.value ? "Passwords don't match." : "");
  };

  return (
    <>
      <TextField
        name="password"
        label={label}
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint="At least 8 characters."
        onInput={syncMatch}
      />
      <TextField
        name="confirmPassword"
        label={`Confirm ${label.toLowerCase()}`}
        type="password"
        autoComplete="new-password"
        required
        onInput={syncMatch}
      />
    </>
  );
}
