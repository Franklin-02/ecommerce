import type { Metadata } from "next";
import { CouponsView } from "@/components/admin/coupons-view";

export const metadata: Metadata = { title: "Coupons | Admin" };

export default function Page() {
  return <CouponsView />;
}
