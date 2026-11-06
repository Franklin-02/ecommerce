"use client";

import {
  Boxes,
  ClipboardList,
  KanbanSquare,
  LayoutDashboard,
  ListChecks,
  UserRound,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { DashboardShell, type ShellNavGroup } from "@/components/dashboard/shell";
import { useCurrentEmployee } from "@/stores/auth";
import type { Employee, Notification } from "@/types/commerce";

const nav: ShellNavGroup[] = [
  {
    items: [{ label: "Dashboard", href: "/employee", icon: LayoutDashboard }],
  },
  {
    title: "Fulfillment",
    items: [
      { label: "Assigned orders", href: "/employee/orders", icon: ClipboardList },
      { label: "Order processing", href: "/employee/processing", icon: KanbanSquare },
      { label: "Tasks", href: "/employee/tasks", icon: ListChecks },
    ],
  },
  {
    title: "Lookup",
    items: [
      { label: "Inventory", href: "/employee/inventory", icon: Boxes },
      { label: "Customers", href: "/employee/customers", icon: Users },
    ],
  },
  {
    title: "Me",
    items: [{ label: "Profile", href: "/employee/profile", icon: UserRound }],
  },
];

interface EmployeeShellProps {
  employee: Employee;
  notifications: Notification[];
  children: ReactNode;
}

export function EmployeeShell({ employee: seed, notifications, children }: EmployeeShellProps) {
  const employee = useCurrentEmployee(seed);
  return (
    <DashboardShell
      portal="Employee"
      homeHref="/employee"
      nav={nav}
      user={{ name: employee.name, role: employee.role }}
      notifications={notifications}
    >
      {children}
    </DashboardShell>
  );
}
