import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/account/register-form";

export const metadata: Metadata = { title: "Create an account" };

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
