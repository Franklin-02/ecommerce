import { createPersistedStore, useStore } from "@/lib/store";

const PREFIX = "ohmly.";

export interface Collection<T extends { id: string }> {
  useItems: () => T[];
  /** Snapshot read for event handlers; components subscribe with useItems. */
  get: () => T[];
  add: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
}

/**
 * Editable mock records, saved in the browser. Admin CRUD screens read and write
 * through this, so their changes survive a reload without any backend.
 */
export function createCollection<T extends { id: string }>(name: string, seed: T[]): Collection<T> {
  const store = createPersistedStore<T[]>(`${PREFIX}admin.${name}.v2`, seed);
  return {
    useItems: () => useStore(store),
    get: store.get,
    add: (item) => store.set((items) => [item, ...items]),
    update: (id, patch) =>
      store.set((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item))),
    remove: (id) => store.set((items) => items.filter((item) => item.id !== id)),
  };
}

/** Clears everything the demo has saved in this browser, then starts fresh. */
export function resetDemoData() {
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(PREFIX))
    .forEach((key) => window.localStorage.removeItem(key));
  window.location.reload();
}

export const newId = (prefix: string) => `${prefix}_${Date.now().toString(36)}`;
