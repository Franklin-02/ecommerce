import type { Metadata } from "next";
import { DashboardView } from "@/components/admin/dashboard-view";
import { getCategorySales, getDailySales } from "@/services/operations";

export const metadata: Metadata = { title: "Dashboard | Admin" };

export default async function AdminDashboardPage() {
  const [sales, categorySales] = await Promise.all([getDailySales(), getCategorySales()]);
  return <DashboardView sales={sales} categorySales={categorySales} />;
}
