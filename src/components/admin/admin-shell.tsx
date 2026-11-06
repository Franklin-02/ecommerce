"use client";

import {
  BadgeCheck,
  ChartColumn,
  FolderTree,
  GalleryHorizontal,
  LayoutDashboard,
  Megaphone,
  Package,
  Settings,
  ShoppingCart,
  TicketPercent,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";
import type { ReactNode } from "react";
import { DashboardShell, type ShellNavGroup } from "@/components/dashboard/shell";
import type { Notification } from "@/types/commerce";

export const ADMIN_USER = { name: "Revathi Natarajan", role: "Store Manager" };

const nav: ShellNavGroup[] = [
  { items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
  {
    title: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Brands", href: "/admin/brands", icon: BadgeCheck },
      { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
      { label: "Promotions", href: "/admin/promotions", icon: Megaphone },
      { label: "Banners", href: "/admin/banners", icon: GalleryHorizontal },
    ],
  },
  {
    title: "Organization",
    items: [
      { label: "Employees", href: "/admin/employees", icon: UserCog },
      { label: "Reports", href: "/admin/reports", icon: ChartColumn },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminShell({ notifications, children }: { notifications: Notification[]; children: ReactNode }) {
  return (
    <DashboardShell portal="Admin" homeHref="/admin" nav={nav} user={ADMIN_USER} notifications={notifications}>
      {children}
    </DashboardShell>
  );
}
