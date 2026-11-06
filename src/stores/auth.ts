import { demoCustomer } from "@/data/customers";
import { demoEmployee, employees as seedEmployees } from "@/data/employees";
import { createPersistedStore, useStore } from "@/lib/store";
import { employeesCollection } from "@/stores/admin-data";
import type { Address, Employee } from "@/types/commerce";

export type Role = "admin" | "employee" | "customer";

export interface Session {
  role: Role;
  name: string;
  email: string;
  phone: string;
  /** Set on customer sessions. */
  customerId?: string;
  /** Set on admin and employee sessions; matches an employee record. */
  employeeId?: string;
  /** Job title, shown in the portal chrome. */
  title?: string;
}

/** Every demo account signs in with this password. */
export const DEMO_PASSWORD = "demo1234";

const demoAdmin = seedEmployees.find((employee) => employee.access === "admin") ?? seedEmployees[0];

export interface DemoAccount {
  role: Role;
  label: string;
  name: string;
  email: string;
  password: string;
}

/**
 * The one-click accounts on the login page, one per role. The staff tiles follow
 * the live employee records, so edits in Admin > Employees never strand a button.
 */
export function useDemoAccounts(): DemoAccount[] {
  const employees = employeesCollection.useItems();
  const usable = employees.filter((employee) => employee.status !== "inactive");
  const admin = usable.find((employee) => employee.access === "admin") ?? demoAdmin;
  const staff =
    usable.find((employee) => employee.id === demoEmployee.id && employee.access !== "admin") ??
    usable.find((employee) => employee.access !== "admin" && employee.id !== admin.id) ??
    demoEmployee;
  return [
    { role: "customer", label: "Customer", name: demoCustomer.name, email: demoCustomer.email, password: DEMO_PASSWORD },
    { role: "employee", label: "Employee", name: staff.name, email: staff.email, password: staff.password ?? DEMO_PASSWORD },
    { role: "admin", label: "Admin", name: admin.name, email: admin.email, password: admin.password ?? DEMO_PASSWORD },
  ];
}

/** v3: sessions gained roles, so older customer-only sessions are discarded. */
const sessionStore = createPersistedStore<Session | null>("ohmly.session.v3", null);
/** Saved address books, keyed by customer so accounts on one browser stay separate. */
const addressStore = createPersistedStore<Record<string, Address[]>>("ohmly.addresses.v3", {});

export const homeFor = (role: Role) => (role === "admin" ? "/admin" : role === "employee" ? "/employee" : "/");

/** Where to land after signing in: `next` if it belongs to this role's area, else the role's home. */
export function landingPath(role: Role, next?: string) {
  if (!next) return homeFor(role);
  const area: Role = next.startsWith("/admin") ? "admin" : next.startsWith("/employee") ? "employee" : "customer";
  return area === role ? next : homeFor(role);
}

export type SignInResult = { ok: true; role: Role } | { ok: false; message: string };

/**
 * Simulated sign-in. Staff accounts (the rows the admin manages under Employees)
 * must match their stored password; any other valid email signs in as a customer.
 */
export function authenticate(email: string, password: string): SignInResult {
  const normalized = email.trim().toLowerCase();
  const staff = employeesCollection.get().find((employee) => employee.email.toLowerCase() === normalized);
  if (staff) {
    if (staff.status === "inactive") {
      return { ok: false, message: "This staff account is inactive. Ask your admin to reactivate it." };
    }
    if (password !== (staff.password ?? DEMO_PASSWORD)) {
      return { ok: false, message: "That password doesn't match this staff account." };
    }
    const role: Role = staff.access === "admin" ? "admin" : "employee";
    sessionStore.set({ role, employeeId: staff.id, name: staff.name, email: staff.email, phone: staff.phone, title: staff.role });
    return { ok: true, role };
  }
  const isDemo = normalized === demoCustomer.email;
  const name = isDemo
    ? demoCustomer.name
    : normalized.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  sessionStore.set({
    role: "customer",
    customerId: isDemo ? demoCustomer.id : `cus_${normalized}`,
    name,
    email,
    phone: isDemo ? demoCustomer.phone : "",
  });
  return { ok: true, role: "customer" };
}

export function register(name: string, email: string) {
  sessionStore.set({ role: "customer", customerId: `cus_${email.toLowerCase()}`, name, email, phone: "" });
}

export const signOut = () => sessionStore.set(null);
export const updateProfile = (patch: Partial<Session>) =>
  sessionStore.set((session) => (session ? { ...session, ...patch } : session));

export const useSession = () => useStore(sessionStore);

/** The signed-in staff member's live record; `fallback` covers the server render and the demo. */
export function useCurrentEmployee(fallback: Employee): Employee {
  const session = useStore(sessionStore);
  const employees = employeesCollection.useItems();
  if (!session?.employeeId) return fallback;
  return employees.find((employee) => employee.id === session.employeeId) ?? fallback;
}

/** The signed-in customer's address book, seeded from the demo account. */
export function useAddresses() {
  const session = useStore(sessionStore);
  const books = useStore(addressStore);
  const customerId = session?.customerId;
  if (!customerId) return [];
  return books[customerId] ?? (customerId === demoCustomer.id ? demoCustomer.addresses : []);
}

export function saveAddresses(addresses: Address[]) {
  const customerId = sessionStore.get()?.customerId;
  if (customerId) addressStore.set((books) => ({ ...books, [customerId]: addresses }));
}
