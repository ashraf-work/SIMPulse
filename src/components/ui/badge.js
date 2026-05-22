import { cn } from "@/lib/utils";

const tones = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-blue-50 text-blue-700 ring-blue-200",
  activated: "bg-(--foreground) text-white",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  neutral: "bg-slate-100 text-slate-600 ring-slate-200"
};

export function Badge({ className, tone = "neutral", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset",
        tones[tone] || tones.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
