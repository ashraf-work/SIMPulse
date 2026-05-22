"use client";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10",
        className
      )}
      {...props}
    />
  );
}
