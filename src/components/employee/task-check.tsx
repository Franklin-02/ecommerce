"use client";

import { CheckboxField } from "@/components/ui/form";
import { cn } from "@/lib/cn";
import { tasksCollection } from "@/stores/admin-data";
import type { EmployeeTask } from "@/types/commerce";

export function TaskCheck({ task }: { task: EmployeeTask }) {
  return (
    <CheckboxField
      checked={task.done}
      onChange={(event) => tasksCollection.update(task.id, { done: event.target.checked })}
      label={<span className={cn(task.done && "text-ink-500 line-through")}>{task.title}</span>}
    />
  );
}
