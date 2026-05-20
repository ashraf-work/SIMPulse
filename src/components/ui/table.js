import { cn } from "@/lib/utils";

export function Table({ className, ...props }) {
  return <table className={cn("w-full text-left text-sm", className)} {...props} />;
}

export function Th({ className, ...props }) {
  return (
    <th
      className={cn("px-5 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }) {
  return <td className={cn("px-5 py-4 align-middle font-semibold text-neutral-700", className)} {...props} />;
}
