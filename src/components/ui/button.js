"use client";

import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", size = "default", ...props }) {
  const variants = {
    default: "bg-red-500 text-white shadow-sm shadow-red-500/20 hover:bg-red-600 hover:shadow-md hover:shadow-red-500/25",
    dark: "bg-slate-900 text-white shadow-sm shadow-slate-900/15 hover:bg-slate-800 hover:shadow-md",
    outline: "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
  };
  const sizes = {
    default: "h-10 px-4",
    sm: "h-8 px-3 text-xs",
    lg: "h-11 px-5",
    icon: "h-9 w-9 p-0"
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
