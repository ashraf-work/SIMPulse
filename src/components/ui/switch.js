"use client";

import { cn } from "@/lib/utils";

export function Switch({ checked, onCheckedChange }) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-7 w-12 rounded-full transition",
        checked ? "bg-red-500" : "bg-neutral-200"
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition",
          checked ? "left-6" : "left-1"
        )}
      />
    </button>
  );
}
