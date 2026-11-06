import type { Metadata } from "next";
import { SettingsView } from "@/components/admin/settings-view";

export const metadata: Metadata = { title: "Settings | Admin" };

export default function Page() {
  return <SettingsView />;
}
