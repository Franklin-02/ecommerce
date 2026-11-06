/** Session and clock for the employee portal. A real API replaces these bodies. */
import { demoEmployee } from "@/data/employees";
import { MOCK_TODAY } from "@/data/seed";
import type { Employee } from "@/types/commerce";

export interface PortalClock {
  /** ISO date of the working day. */
  today: string;
  /** ISO timestamp used to decide what is overdue. */
  now: string;
}

export const getCurrentEmployee = async (): Promise<Employee> => demoEmployee;

/** A fixed mid-shift clock (1pm IST), so the demo's overdue counts never drift. */
export const getPortalClock = async (): Promise<PortalClock> => ({
  today: MOCK_TODAY,
  now: `${MOCK_TODAY}T07:30:00.000Z`,
});
