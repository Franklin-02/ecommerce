"use client";

import Link from "next/link";
import { DataTable, type Column, type TableFilter } from "@/components/dashboard/data-table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/format";
import type { PortalClock } from "@/services/employee";
import { useCurrentEmployee } from "@/stores/auth";
import type { Employee, EmployeeTask } from "@/types/commerce";
import { TaskCheck } from "./task-check";
import { isOverdue, priorityMeta, taskKindLabels, useEmployeeTasks } from "./work";

const PRIORITIES: EmployeeTask["priority"][] = ["high", "medium", "low"];

export function TaskBoard({ employee: seed, clock }: { employee: Employee; clock: PortalClock }) {
  const employee = useCurrentEmployee(seed);
  const tasks = useEmployeeTasks(employee.id);
  const open = tasks.filter((task) => !task.done);
  const overdue = open.filter((task) => isOverdue(task, clock.now));

  const columns: Column<EmployeeTask>[] = [
    {
      key: "task",
      header: "Task",
      sortValue: (task) => task.title,
      cell: (task) => (
        <div className="min-w-48">
          <TaskCheck task={task} />
          {task.orderId && (
            <Link href={`/employee/orders/view?id=${task.orderId}`} className="mt-0.5 ml-6.5 block text-xs font-medium text-brand-600">
              View order
            </Link>
          )}
        </div>
      ),
    },
    { key: "kind", header: "Type", hideBelow: "md", sortValue: (task) => task.kind, cell: (task) => taskKindLabels[task.kind] },
    {
      key: "priority",
      header: "Priority",
      sortValue: (task) => PRIORITIES.indexOf(task.priority),
      cell: (task) => <StatusBadge {...priorityMeta[task.priority]} />,
    },
    {
      key: "due",
      header: "Due",
      hideBelow: "md",
      sortValue: (task) => task.dueAt,
      cell: (task) => (
        <span className="whitespace-nowrap">
          {formatDateTime(task.dueAt)}
          {isOverdue(task, clock.now) && <span className="ml-2 text-xs font-semibold text-deal">Overdue</span>}
        </span>
      ),
    },
  ];

  const filters: TableFilter<EmployeeTask>[] = [
    {
      key: "status",
      label: "All tasks",
      options: [
        { value: "open", label: "Open" },
        { value: "overdue", label: "Overdue" },
        { value: "done", label: "Completed" },
      ],
      matches: (task, value) =>
        value === "overdue" ? isOverdue(task, clock.now) : task.done === (value === "done"),
    },
    {
      key: "priority",
      label: "All priorities",
      options: PRIORITIES.map((priority) => ({ value: priority, label: priorityMeta[priority].label })),
      matches: (task, value) => task.priority === value,
    },
  ];

  return (
    <>
      <PageHeader title="Tasks" description="Everything assigned to you, soonest due first." />
      <div className="mb-4 grid grid-cols-3 gap-3">
        <KpiCard label="Open" value={String(open.length)} />
        <KpiCard label="Overdue" value={String(overdue.length)} />
        <KpiCard label="Completed" value={String(tasks.length - open.length)} />
      </div>
      <DataTable
        rows={tasks}
        columns={columns}
        filters={filters}
        getRowKey={(task) => task.id}
        label="Tasks"
        searchPlaceholder="Search tasks"
        searchText={(task) => `${task.title} ${taskKindLabels[task.kind]}`}
        emptyTitle="No matching tasks"
      />
    </>
  );
}
