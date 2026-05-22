"use client";

import { cn } from "@/lib/utils";

export function Switch({ checked, onCheckedChange }) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full transition duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/10",
        checked ? "bg-red-500" : "bg-neutral-200"
      )}
      aria-pressed={checked}
    >
      <span
          className={cn(
          "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition duration-200",
          checked ? "left-6" : "left-1"
        )}
      />
    </button>
  );
}
