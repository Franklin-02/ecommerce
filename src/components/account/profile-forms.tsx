"use client";

import { Button } from "@/components/ui/button";
import { Form, FormSection, TextField } from "@/components/ui/form";
import { updateProfile, useSession } from "@/stores/auth";
import { showToast } from "@/stores/toast";
import { NewPasswordFields } from "./password-fields";
import { PHONE_MESSAGE, PHONE_PATTERN } from "./patterns";

export function ProfileForms() {
  const session = useSession();
  if (!session) return null;

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Profile</h1>
      <p className="mt-1 mb-6 text-sm text-ink-500">Update your details and password.</p>

      <div className="max-w-2xl space-y-5">
        <div className="rounded-card border border-line p-5">
          <Form
            onValid={(values) => {
              updateProfile({ name: values.name, email: values.email, phone: values.phone });
              showToast("Profile updated");
            }}
          >
            <FormSection legend="Personal details">
              <TextField name="name" label="Full name" autoComplete="name" required full defaultValue={session.name} />
              <TextField name="email" label="Email" type="email" autoComplete="email" required defaultValue={session.email} />
              <TextField
                name="phone"
                label="Phone"
                type="tel"
                autoComplete="tel"
                pattern={PHONE_PATTERN}
                patternMessage={PHONE_MESSAGE}
                defaultValue={session.phone}
              />
            </FormSection>
            <div className="col-span-full">
              <Button type="submit">Save changes</Button>
            </div>
          </Form>
        </div>

        <div className="rounded-card border border-line p-5">
          <Form
            onValid={(_values, form) => {
              form.reset();
              showToast("Password changed");
            }}
          >
            <FormSection legend="Change password">
              <TextField name="currentPassword" label="Current password" type="password" autoComplete="current-password" required full />
              <NewPasswordFields label="New password" />
            </FormSection>
            <div className="col-span-full">
              <Button type="submit">Update password</Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
