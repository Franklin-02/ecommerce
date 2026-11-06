import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="py-10">
      <EmptyState
        icon={SearchX}
        title="We couldn't find that page"
        body="The link may be out of date, or the page may have moved. Try searching, or head back to the homepage."
        action={<ButtonLink href="/">Back to the homepage</ButtonLink>}
      />
    </div>
  );
}
