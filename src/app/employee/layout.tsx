import type { Metadata } from "next";
import { PortalGate } from "@/components/auth/gates";
import { EmployeeShell } from "@/components/employee/employee-shell";
import { getCurrentEmployee } from "@/services/employee";
import { getNotifications } from "@/services/operations";

export const metadata: Metadata = {
  title: { default: "Employee portal", template: "%s | Kanishka Employee" },
};

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const [employee, notifications] = await Promise.all([getCurrentEmployee(), getNotifications()]);
  return (
    <PortalGate area="employee">
      <EmployeeShell
        employee={employee}
        notifications={notifications.filter((item) => item.kind === "order" || item.kind === "stock")}
      >
        {children}
      </EmployeeShell>
    </PortalGate>
  );
}
