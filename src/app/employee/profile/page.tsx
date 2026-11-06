import type { Metadata } from "next";
import { EmployeeProfile } from "@/components/employee/employee-profile";
import { getCurrentEmployee } from "@/services/employee";

export const metadata: Metadata = { title: "Profile" };

export default async function EmployeeProfilePage() {
  return <EmployeeProfile employee={await getCurrentEmployee()} />;
}
