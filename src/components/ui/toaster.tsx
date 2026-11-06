"use client";

import { CheckCircle2 } from "lucide-react";
import { dismissToast, useToasts } from "@/stores/toast";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex max-w-md animate-toast items-center gap-3 rounded-full bg-ink-950 py-2.5 pr-3 pl-4 text-sm text-white shadow-overlay"
        >
          <CheckCircle2 className="size-4 shrink-0 text-emerald-400" aria-hidden />
          <span className="min-w-0 truncate">{toast.message}</span>
          {toast.action && (
            <button
              type="button"
              className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25"
              onClick={() => {
                toast.action?.onClick();
                dismissToast(toast.id);
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
