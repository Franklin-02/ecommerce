import { useSyncExternalStore } from "react";

/**
 * A minimal external store. useSyncExternalStore renders the initial value on
 * the server and during hydration, then swaps to the live value, so persisted
 * state never causes a hydration mismatch.
 */
export interface Store<T> {
  get: () => T;
  set: (next: T | ((current: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
  serverSnapshot: () => T;
}

/** `init` runs on the first read, silently, because reads happen during render. */
export function createStore<T>(initial: T, init?: () => T): Store<T> {
  let value = initial;
  let pendingInit = init;
  const listeners = new Set<() => void>();

  const get = () => {
    if (pendingInit) {
      const run = pendingInit;
      pendingInit = undefined;
      value = run();
    }
    return value;
  };

  return {
    get,
    set(next) {
      value = typeof next === "function" ? (next as (current: T) => T)(get()) : next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    serverSnapshot: () => initial,
  };
}

/** A store mirrored to localStorage and kept in sync across browser tabs. */
export function createPersistedStore<T>(key: string, initial: T): Store<T> {
  const parse = (raw: string | null) => {
    if (raw === null) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  };

  const store = createStore(initial, () => {
    if (typeof window === "undefined") return initial;
    window.addEventListener("storage", (event) => {
      if (event.key === key) store.set(parse(event.newValue));
    });
    try {
      return parse(window.localStorage.getItem(key));
    } catch {
      return initial; // Storage can be blocked; carry on in memory.
    }
  });

  return {
    ...store,
    set(next) {
      store.set(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(store.get()));
      } catch {
        // Quota or blocked storage; the in-memory value still works this session.
      }
    },
  };
}

const noSubscription = () => () => {};

/** False during SSR and hydration. Gate redirects on this: persisted state isn't readable until it's true. */
export function useHydrated() {
  return useSyncExternalStore(noSubscription, () => true, () => false);
}

export function useStore<T>(store: Store<T>) {
  return useSyncExternalStore(store.subscribe, store.get, store.serverSnapshot);
}
