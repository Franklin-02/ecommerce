import { useMemo } from "react";
import type { StatusTone } from "@/lib/status";
import { tasksCollection } from "@/stores/admin-data";
import { useOrders } from "@/stores/orders";
import type { EmployeeTask, Order, OrderStatus } from "@/types/commerce";

export const ACTIVE_STATUSES: OrderStatus[] = ["processing", "packed", "shipped"];

/** Button text for moving an order into each status. */
export const advanceLabels: Partial<Record<OrderStatus, string>> = {
  processing: "Start processing",
  packed: "Mark packed",
  shipped: "Mark shipped",
  delivered: "Mark delivered",
};

export const priorityMeta: Record<EmployeeTask["priority"], { label: string; tone: StatusTone }> = {
  high: { label: "High", tone: "danger" },
  medium: { label: "Medium", tone: "warning" },
  low: { label: "Low", tone: "neutral" },
};

export const taskKindLabels: Record<EmployeeTask["kind"], string> = {
  "pick-pack": "Pick and pack",
  "stock-count": "Stock count",
  "customer-callback": "Customer callback",
  returns: "Returns",
  restock: "Restock",
};

export const isOverdue = (task: EmployeeTask, now: string) => !task.done && task.dueAt < now;

/** Orders still in progress for one employee: next-day first, then oldest first. */
export function useAssignedOrders(employeeId: string): Order[] {
  const orders = useOrders();
  return useMemo(
    () =>
      orders
        .filter((order) => order.assignedToId === employeeId && ACTIVE_STATUSES.includes(order.status))
        .sort(
          (a, b) =>
            Number(b.deliveryMethod === "next-day") - Number(a.deliveryMethod === "next-day") ||
            a.placedAt.localeCompare(b.placedAt),
        ),
    [orders, employeeId],
  );
}

export function useEmployeeTasks(employeeId: string): EmployeeTask[] {
  const tasks = tasksCollection.useItems();
  return useMemo(
    () => tasks.filter((task) => task.assigneeId === employeeId).sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
    [tasks, employeeId],
  );
}
