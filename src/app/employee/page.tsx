import { EmployeeDashboard } from "@/components/employee/employee-dashboard";
import { getCurrentEmployee, getPortalClock } from "@/services/employee";

export default async function EmployeeHomePage() {
  const [employee, clock] = await Promise.all([getCurrentEmployee(), getPortalClock()]);
  return <EmployeeDashboard employee={employee} clock={clock} />;
}
