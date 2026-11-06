"use client";

import { PHONE_MESSAGE, PHONE_PATTERN } from "@/components/account/patterns";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Form, TextField } from "@/components/ui/form";
import { formatDate, initials } from "@/lib/format";
import { employeesCollection } from "@/stores/admin-data";
import { useCurrentEmployee } from "@/stores/auth";
import { showToast } from "@/stores/toast";
import type { Employee } from "@/types/commerce";
import { Panel } from "./panel";

export function EmployeeProfile({ employee: seed }: { employee: Employee }) {
  const employee = useCurrentEmployee(seed);

  const details: [string, string][] = [
    ["Role", employee.role],
    ["Department", employee.department],
    ["Location", employee.location],
    ["Shift", employee.shift],
    ["Joined", formatDate(employee.joinedAt)],
  ];

  return (
    <>
      <PageHeader title="Profile" description="Your work details and contact information." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Work details">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white" aria-hidden>
              {initials(employee.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink-950">{employee.name}</p>
              <p className="text-[0.8125rem] text-ink-500">{employee.role}</p>
            </div>
          </div>
          <dl className="space-y-2.5 text-sm">
            {details.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-ink-500">{label}</dt>
                <dd className="text-right font-medium text-ink-900">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Contact details" className="lg:col-span-2">
          {/* The key remounts the form when saved values load, since its inputs are uncontrolled. */}
          <Form
            key={`${employee.email}|${employee.phone}`}
            onValid={(values) => {
              employeesCollection.update(employee.id, { email: values.email, phone: values.phone });
              showToast("Contact details saved");
            }}
          >
            <TextField name="email" label="Work email" type="email" required autoComplete="email" defaultValue={employee.email} />
            <TextField
              name="phone"
              label="Phone"
              type="tel"
              required
              autoComplete="tel"
              pattern={PHONE_PATTERN}
              patternMessage={PHONE_MESSAGE}
              defaultValue={employee.phone}
            />
            <div className="col-span-full">
              <Button type="submit">Save changes</Button>
            </div>
          </Form>
        </Panel>
      </div>
    </>
  );
}
