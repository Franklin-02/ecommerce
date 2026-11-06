"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  label: string;
  side?: "left" | "right";
  children: ReactNode;
}

/** Built on the native <dialog>, which supplies the focus trap, Esc and inert background. */
export function Drawer({ open, onClose, title, label, side = "right", children }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "m-0 h-dvh max-h-none w-full max-w-md bg-surface text-ink-900 shadow-overlay",
        side === "right" ? "ml-auto open:animate-drawer-right" : "mr-auto open:animate-drawer-left",
      )}
    >
      <div className="flex h-full flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <div className="text-lg font-semibold tracking-tight">{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-10 place-items-center rounded-full text-ink-600 hover:bg-surface-sunken"
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
