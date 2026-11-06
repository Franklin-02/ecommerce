import { createStore, useStore } from "@/lib/store";

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; onClick: () => void };
}

const toastStore = createStore<Toast[]>([]);
let nextId = 1;

export const dismissToast = (id: number) =>
  toastStore.set((toasts) => toasts.filter((toast) => toast.id !== id));

export function showToast(message: string, action?: Toast["action"]) {
  const id = nextId++;
  // Only the latest two stay on screen, so rapid clicks don't stack up.
  toastStore.set((toasts) => [...toasts.slice(-1), { id, message, action }]);
  setTimeout(() => dismissToast(id), 3500);
}

export const useToasts = () => useStore(toastStore);
