import type { Metadata } from "next";
import { BrandsView } from "@/components/admin/brands-view";

export const metadata: Metadata = { title: "Brands | Admin" };

export default function Page() {
  return <BrandsView />;
}
