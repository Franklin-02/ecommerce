import type { Metadata } from "next";
import { ReportsView } from "@/components/admin/reports-view";
import { getCategorySales, getDailySales } from "@/services/operations";

export const metadata: Metadata = { title: "Reports | Admin" };

export default async function AdminReportsPage() {
  const [sales, categorySales] = await Promise.all([getDailySales(), getCategorySales()]);
  return <ReportsView sales={sales} categorySales={categorySales} />;
}
