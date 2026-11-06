import type { Metadata } from "next";
import { TaskBoard } from "@/components/employee/task-board";
import { getCurrentEmployee, getPortalClock } from "@/services/employee";

export const metadata: Metadata = { title: "Tasks" };

export default async function EmployeeTasksPage() {
  const [employee, clock] = await Promise.all([getCurrentEmployee(), getPortalClock()]);
  return <TaskBoard employee={employee} clock={clock} />;
}
