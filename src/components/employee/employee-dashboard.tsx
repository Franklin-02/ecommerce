"use client";

import { Clock, MapPin, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatShortDate } from "@/lib/format";
import { orderStatusMeta } from "@/lib/status";
import type { PortalClock } from "@/services/employee";
import { useOrders } from "@/stores/orders";
import { useCurrentEmployee } from "@/stores/auth";
import type { Employee } from "@/types/commerce";
import { Panel } from "./panel";
import { TaskCheck } from "./task-check";
import { isOverdue, useAssignedOrders, useEmployeeTasks } from "./work";

const QUEUE_LENGTH = 5;

export function EmployeeDashboard({ employee: seed, clock }: { employee: Employee; clock: PortalClock }) {
  const employee = useCurrentEmployee(seed);
  const allOrders = useOrders();
  const assigned = useAssignedOrders(employee.id);
  const tasks = useEmployeeTasks(employee.id);

  const packedToday = useMemo(
    () =>
      allOrders.filter(
        (order) =>
          order.assignedToId === employee.id &&
          order.timeline.some(
            (event) => event.status === "packed" && (event.at.startsWith(clock.today) || event.by === employee.name),
          ),
      ).length,
    [allOrders, employee, clock.today],
  );

  const openTasks = tasks.filter((task) => !task.done);
  const dueToday = openTasks.filter((task) => task.dueAt.startsWith(clock.today));
  const overdue = openTasks.filter((task) => isOverdue(task, clock.now));
  const hour = new Date(new Date(clock.now).getTime() + 5.5 * 3_600_000).getUTCHours(); // Indian Standard Time
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <PageHeader
        title={`${greeting}, ${employee.name.split(" ")[0]}`}
        description={`Here's your shift for ${formatDate(clock.now)}.`}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Assigned open orders" value={String(assigned.length)} hint="Processing through shipped" />
        <KpiCard label="Packed today" value={String(packedToday)} hint="Your orders" />
        <KpiCard label="Tasks due today" value={String(dueToday.length)} hint={`${openTasks.length} open in total`} />
        <KpiCard label="Overdue tasks" value={String(overdue.length)} hint={overdue.length ? "Handle these first" : "You're all caught up"} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Today's priority queue" action={{ label: "All orders", href: "/employee/orders" }} className="lg:col-span-2">
          {assigned.length === 0 ? (
            <EmptyState icon={PackageCheck} title="Queue clear" body="No orders are assigned to you right now." />
          ) : (
            <ol className="divide-y divide-line">
              {assigned.slice(0, QUEUE_LENGTH).map((order) => {
                const status = orderStatusMeta[order.status];
                const units = order.lines.reduce((sum, line) => sum + line.quantity, 0);
                return (
                  <li key={order.id}>
                    <Link href={`/employee/orders/view?id=${order.id}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-1 py-2.5 hover:bg-surface-muted">
                      <span className="min-w-0 flex-1 basis-40">
                        <span className="block text-sm font-semibold text-ink-950">{order.number}</span>
                        <span className="block truncate text-[0.8125rem] text-ink-500">
                          {order.customerName} · {units} {units === 1 ? "item" : "items"} · {formatShortDate(order.placedAt)}
                        </span>
                      </span>
                      {order.deliveryMethod === "next-day" && <Badge tone="warning">Next-day</Badge>}
                      <StatusBadge label={status.label} tone={status.tone} />
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>

        <div className="grid min-w-0 content-start gap-4">
          <Panel title="Task summary" action={{ label: "All tasks", href: "/employee/tasks" }}>
            {tasks.length === 0 ? (
              <p className="text-sm text-ink-500">No tasks assigned.</p>
            ) : (
              <ul className="space-y-2.5">
                {tasks.slice(0, QUEUE_LENGTH).map((task) => (
                  <li key={task.id}>
                    <TaskCheck task={task} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Your shift">
            <ul className="space-y-2 text-sm text-ink-800">
              <li className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-ink-500" aria-hidden />
                {employee.shift}
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0 text-ink-500" aria-hidden />
                {employee.location}
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
