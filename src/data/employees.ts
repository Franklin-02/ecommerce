import type { Employee, EmployeeTask } from "@/types/commerce";
import { daysAgo, dayKey } from "./seed";

export const employees: Employee[] = [
  { id: "emp_001", name: "Revathi Natarajan", email: "revathi.natarajan@ohmly.example", phone: "+91 90000 20001", role: "Store Manager", access: "admin", department: "Operations", status: "active", joinedAt: dayKey(1420), shift: "Mon–Sat, 9:30am–6:30pm", location: "Chennai HQ" },
  { id: "emp_002", name: "Senthil Kumar", email: "senthil.kumar@ohmly.example", phone: "+91 90000 20002", role: "Fulfillment Lead", department: "Fulfillment", status: "active", joinedAt: dayKey(980), shift: "Mon–Sat, 7am–3pm", location: "Sriperumbudur Warehouse" },
  { id: "emp_003", name: "Kaviya Rajendran", email: "kaviya.rajendran@ohmly.example", phone: "+91 90000 20003", role: "Fulfillment Associate", department: "Fulfillment", status: "active", joinedAt: dayKey(410), shift: "Mon–Sat, 8am–4pm", location: "Sriperumbudur Warehouse" },
  { id: "emp_004", name: "Manikandan Selvam", email: "manikandan.selvam@ohmly.example", phone: "+91 90000 20004", role: "Fulfillment Associate", department: "Fulfillment", status: "active", joinedAt: dayKey(265), shift: "Mon–Sat, 12pm–8pm", location: "Sriperumbudur Warehouse" },
  { id: "emp_005", name: "Ilakkiya Mohan", email: "ilakkiya.mohan@ohmly.example", phone: "+91 90000 20005", role: "Inventory Specialist", department: "Inventory", status: "active", joinedAt: dayKey(720), shift: "Mon–Sat, 8am–4pm", location: "Sriperumbudur Warehouse" },
  { id: "emp_006", name: "Dinesh Babu", email: "dinesh.babu@ohmly.example", phone: "+91 90000 20006", role: "Customer Support", department: "Support", status: "active", joinedAt: dayKey(530), shift: "Sun–Fri, 10am–6pm", location: "Remote" },
  { id: "emp_007", name: "Yamini Prakash", email: "yamini.prakash@ohmly.example", phone: "+91 90000 20007", role: "Customer Support", department: "Support", status: "on-leave", joinedAt: dayKey(340), shift: "Mon–Sat, 1pm–9pm", location: "Remote" },
  { id: "emp_008", name: "Fathima Rahman", email: "fathima.rahman@ohmly.example", phone: "+91 90000 20008", role: "Marketing Manager", department: "Marketing", status: "active", joinedAt: dayKey(610), shift: "Mon–Sat, 9:30am–6:30pm", location: "Chennai HQ" },
  { id: "emp_009", name: "Peter Arokiaraj", email: "peter.arokiaraj@ohmly.example", phone: "+91 90000 20009", role: "Fulfillment Associate", department: "Fulfillment", status: "inactive", joinedAt: dayKey(860), shift: "Not scheduled", location: "Sriperumbudur Warehouse" },
];

/** The employee signed in to the employee portal demo. */
export const demoEmployee = employees[2];

/** Fulfillment staff who can be assigned orders. */
export const assignableEmployees = employees.filter(
  (employee) => employee.department === "Fulfillment" && employee.status === "active",
);

export const employeeTasks: EmployeeTask[] = [
  { id: "tsk_001", assigneeId: "emp_003", title: "Cycle count: audio aisle B4", kind: "stock-count", priority: "medium", dueAt: daysAgo(0, 15), done: false },
  { id: "tsk_002", assigneeId: "emp_003", title: "Process 3 inbound returns from yesterday", kind: "returns", priority: "high", dueAt: daysAgo(0, 12), done: false },
  { id: "tsk_003", assigneeId: "emp_003", title: "Restock packing station 2 with mailers", kind: "restock", priority: "low", dueAt: daysAgo(0, 16), done: true },
  { id: "tsk_004", assigneeId: "emp_003", title: "Call customer about delayed Titan 27000", kind: "customer-callback", priority: "high", dueAt: daysAgo(0, 11), done: false },
  { id: "tsk_005", assigneeId: "emp_003", title: "Label incoming Meshline shipment", kind: "restock", priority: "medium", dueAt: daysAgo(-1, 10), done: false },
  { id: "tsk_006", assigneeId: "emp_004", title: "Cycle count: phones cage A1", kind: "stock-count", priority: "medium", dueAt: daysAgo(0, 17), done: false },
  { id: "tsk_007", assigneeId: "emp_002", title: "Review weekly carrier exceptions", kind: "pick-pack", priority: "medium", dueAt: daysAgo(-1, 9), done: false },
];
