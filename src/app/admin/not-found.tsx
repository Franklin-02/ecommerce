import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminNotFound() {
  return (
    <EmptyState
      icon={SearchX}
      title="Page not found"
      body="This admin page doesn't exist."
      action={<ButtonLink href="/admin">Back to the dashboard</ButtonLink>}
    />
  );
}
