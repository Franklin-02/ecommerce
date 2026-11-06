import type { Metadata } from "next";
import { BannersView } from "@/components/admin/banners-view";

export const metadata: Metadata = { title: "Banners | Admin" };

export default function Page() {
  return <BannersView />;
}
