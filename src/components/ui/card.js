import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("rounded-3xl border border-neutral-100 bg-white card-shadow", className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("p-6 pb-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h2 className={cn("text-lg font-black tracking-tight text-neutral-900", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-3", className)} {...props} />;
}
