"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function EmployeeError({ reset }: { error: Error; reset: () => void }) {
  return (
    <EmptyState
      icon={TriangleAlert}
      title="Something went wrong"
      body="We couldn't load this page. Your order updates are saved."
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
