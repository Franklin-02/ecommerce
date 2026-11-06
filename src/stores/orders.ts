import { orders as seedOrders } from "@/data/orders";
import { createPersistedStore, useStore } from "@/lib/store";
import type { Order, OrderEvent, OrderStatus } from "@/types/commerce";

interface OrderPatch {
  status?: OrderStatus;
  assignedToId?: string;
  paymentStatus?: Order["paymentStatus"];
  events?: OrderEvent[];
}

/** Orders placed in this browser, plus changes to seeded ones. */
const placedStore = createPersistedStore<Order[]>("ohmly.orders.placed.v2", []);
const patchStore = createPersistedStore<Record<string, OrderPatch>>("ohmly.orders.patches.v2", {});

function applyPatch(order: Order, patch?: OrderPatch): Order {
  if (!patch) return order;
  return {
    ...order,
    status: patch.status ?? order.status,
    assignedToId: patch.assignedToId ?? order.assignedToId,
    paymentStatus: patch.paymentStatus ?? order.paymentStatus,
    timeline: [...order.timeline, ...(patch.events ?? [])],
  };
}

let memo: { placed: Order[]; patches: Record<string, OrderPatch>; result: Order[] } | null = null;

function merge(placed: Order[], patches: Record<string, OrderPatch>) {
  if (memo?.placed === placed && memo.patches === patches) return memo.result;
  const result = [...placed, ...seedOrders].map((order) => applyPatch(order, patches[order.id]));
  memo = { placed, patches, result };
  return result;
}

/** All orders, newest first. Admin, employee and customer views share this, so a status change shows everywhere. */
export function useOrders() {
  return merge(useStore(placedStore), useStore(patchStore));
}

export function useOrder(id: string) {
  return useOrders().find((order) => order.id === id);
}

export const placeOrder = (order: Order) => placedStore.set((orders) => [order, ...orders]);

function patchOrder(id: string, change: (patch: OrderPatch) => OrderPatch) {
  patchStore.set((patches) => ({ ...patches, [id]: change(patches[id] ?? {}) }));
}

export function updateOrderStatus(id: string, status: OrderStatus, by: string, note?: string) {
  const event: OrderEvent = { status, at: new Date().toISOString(), by, note };
  patchOrder(id, (patch) => ({
    ...patch,
    status,
    events: [...(patch.events ?? []), event],
    ...(status === "returned" || status === "cancelled" ? { paymentStatus: "refunded" as const } : {}),
  }));
}

export function assignOrder(id: string, employeeId: string) {
  patchOrder(id, (patch) => ({ ...patch, assignedToId: employeeId }));
}
