import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <Container className="animate-pulse pt-5 pb-16" aria-busy="true" aria-label="Loading">
      <div className="h-72 rounded-panel bg-surface-sunken sm:h-96" />
      <div className="mt-12 h-7 w-48 rounded-lg bg-surface-sunken" />
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={index > 1 ? "hidden md:block" : ""}>
            <div className="aspect-square rounded-card bg-surface-sunken" />
            <div className="mt-3 h-4 w-3/4 rounded bg-surface-sunken" />
            <div className="mt-2 h-4 w-1/2 rounded bg-surface-sunken" />
          </div>
        ))}
      </div>
    </Container>
  );
}
