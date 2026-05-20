"use client";

import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", size = "default", ...props }) {
  const variants = {
    default: "bg-red-500 text-white hover:bg-red-500/90 shadow-lg shadow-red-500/15",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10",
    outline: "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50",
    ghost: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  const sizes = {
    default: "h-11 px-5",
    sm: "h-9 px-3 text-xs",
    lg: "h-14 px-7 text-base",
    icon: "h-10 w-10 p-0"
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-black transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
