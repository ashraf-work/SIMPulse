"use client";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-semibold text-neutral-800 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10 placeholder:text-neutral-300",
        className
      )}
      {...props}
    />
  );
}
