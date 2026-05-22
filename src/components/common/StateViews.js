import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Loading data" }) {
  return (
    <div className="flex h-72 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ rows = 5, className }) {
  return (
    <Card className={cn("space-y-3 p-5", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-10 animate-pulse rounded-lg bg-slate-100" />
      ))}
    </Card>
  );
}

export function EmptyState({ title, description }) {
  return (
    <Card className="p-10 text-center">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </Card>
  );
}

export function ErrorState({ message }) {
  return (
    <Card className="border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">
      {message}
    </Card>
  );
}
