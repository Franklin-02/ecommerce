import { AdminShell } from "@/components/admin/admin-shell";
import { PortalGate } from "@/components/auth/gates";
import { getNotifications } from "@/services/operations";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const notifications = await getNotifications();
  return (
    <PortalGate area="admin">
      <AdminShell notifications={notifications}>{children}</AdminShell>
    </PortalGate>
  );
}
