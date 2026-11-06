"use client";

import { useSyncExternalStore } from "react";

const subscribe = (tick: () => void) => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
};
const nowInSeconds = () => Math.floor(Date.now() / 1000);
const noTime = () => null;

/** Counts down to local midnight. Blank during SSR so server and client markup match. */
export function DealCountdown() {
  const now = useSyncExternalStore(subscribe, nowInSeconds, noTime);

  let parts = ["--", "--", "--"];
  if (now !== null) {
    const midnight = new Date(now * 1000);
    midnight.setHours(24, 0, 0, 0);
    const remaining = Math.max(0, Math.floor(midnight.getTime() / 1000) - now);
    parts = [remaining / 3600, (remaining % 3600) / 60, remaining % 60].map((value) =>
      String(Math.floor(value)).padStart(2, "0"),
    );
  }

  return (
    <div role="timer" aria-label="Time left on today's offers" className="flex items-start gap-2">
      {["Hours", "Mins", "Secs"].map((label, index) => (
        <div key={label} className="w-16 rounded-xl bg-white/10 py-2.5 text-center">
          <p className="font-mono text-2xl font-medium text-white tabular-nums">{parts[index]}</p>
          <p className="mt-0.5 text-[0.6875rem] text-white/65">{label}</p>
        </div>
      ))}
    </div>
  );
}
