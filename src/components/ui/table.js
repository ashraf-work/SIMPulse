import { cn } from "@/lib/utils";

export function Table({ className, ...props }) {
  return <table className={cn("w-full text-left text-sm", className)} {...props} />;
}

export function Th({ className, ...props }) {
  return (
    <th
      className={cn("px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }) {
  return <td className={cn("px-4 py-3 align-middle font-medium text-slate-700", className)} {...props} />;
}
