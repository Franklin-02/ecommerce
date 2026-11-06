import type { Metadata } from "next";
import { PromotionsView } from "@/components/admin/promotions-view";

export const metadata: Metadata = { title: "Promotions | Admin" };

export default function Page() {
  return <PromotionsView />;
}
