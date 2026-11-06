import type { Metadata } from "next";
import { ProcessingBoard } from "@/components/employee/processing-board";
import { getCurrentEmployee } from "@/services/employee";

export const metadata: Metadata = { title: "Order processing" };

export default async function ProcessingPage() {
  return <ProcessingBoard employee={await getCurrentEmployee()} />;
}
