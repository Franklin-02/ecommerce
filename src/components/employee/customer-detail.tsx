"use client";

import { ArrowLeft, Mail, Phone, UserX } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import { orderStatusMeta } from "@/lib/status";
import { useOrders } from "@/stores/orders";
import { useCurrentEmployee } from "@/stores/auth";
import type { Customer, Employee } from "@/types/commerce";
import { Panel } from "./panel";

const RECENT_ORDERS = 6;

interface CustomerDetailProps {
  customer?: Customer;
  employee: Employee;
}

export function CustomerDetail({ customer, employee: seed }: CustomerDetailProps) {
  const employee = useCurrentEmployee(seed);
  const orders = useOrders();
  const recent = useMemo(
    () =>
      orders
        .filter((order) => order.customerId === customer?.id)
        .sort((a, b) => b.placedAt.localeCompare(a.placedAt))
        .slice(0, RECENT_ORDERS),
    [orders, customer?.id],
  );

  if (!customer) {
    return (
      <EmptyState
        icon={UserX}
        title="Customer not found"
        body="This customer isn't in the directory."
        action={<ButtonLink href="/employee/customers">Back to customers</ButtonLink>}
      />
    );
  }

  return (
    <>
      <Link href="/employee/customers" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-950">
        <ArrowLeft className="size-4" aria-hidden />
        Customers
      </Link>
      <PageHeader title={customer.name} description={`Customer since ${formatDate(customer.joinedAt)}`} actions={<Badge>{customer.tier}</Badge>} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid min-w-0 content-start gap-4">
          <Panel title="Contact">
            <ul className="space-y-1.5 text-sm text-ink-600">
              <li>
                <a href={`mailto:${customer.email}`} className="inline-flex max-w-full items-center gap-2 hover:text-ink-950">
                  <Mail className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">{customer.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${customer.phone}`} className="inline-flex items-center gap-2 hover:text-ink-950">
                  <Phone className="size-4 shrink-0" aria-hidden />
                  {customer.phone}
                </a>
              </li>
            </ul>
          </Panel>

          <Panel title="Addresses">
            <ul className="space-y-3">
              {customer.addresses.map((address) => (
                <li key={address.id} className="text-sm leading-6 text-ink-800">
                  <p className="font-medium text-ink-950">{address.label}</p>
                  {address.line1}
                  {address.line2 && `, ${address.line2}`}
                  <br />
                  {address.city}, {address.state} – {address.pincode}
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel title="Recent orders" className="lg:col-span-2">
          {recent.length === 0 ? (
            <p className="text-sm text-ink-500">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((order) => {
                const units = order.lines.reduce((sum, line) => sum + line.quantity, 0);
                return (
                  <li key={order.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
                    <span className="min-w-0 flex-1 basis-40">
                      {order.assignedToId === employee.id ? (
                        <Link href={`/employee/orders/view?id=${order.id}`} className="block text-sm font-semibold text-brand-600 hover:text-brand-700">
                          {order.number}
                        </Link>
                      ) : (
                        <span className="block text-sm font-semibold text-ink-950">{order.number}</span>
                      )}
                      <span className="block text-[0.8125rem] text-ink-500">
                        {formatDate(order.placedAt)} · {units} {units === 1 ? "item" : "items"}
                      </span>
                    </span>
                    <StatusBadge {...orderStatusMeta[order.status]} />
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
