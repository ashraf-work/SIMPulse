import { cn } from "@/lib/utils";

const tones = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  approved: "bg-blue-50 text-blue-700 border-blue-100",
  activated: "bg-green-50 text-green-700 border-green-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
  available: "bg-green-50 text-green-700 border-green-100",
  neutral: "bg-neutral-100 text-neutral-600 border-neutral-200"
};

export function Badge({ className, tone = "neutral", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest",
        tones[tone] || tones.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
