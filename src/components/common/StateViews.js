import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LoadingState({ label = "Loading data" }) {
  return (
    <div className="flex h-72 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">{label}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <Card className="p-10 text-center">
      <p className="font-black text-neutral-900">{title}</p>
      <p className="mt-2 text-sm font-medium text-neutral-500">{description}</p>
    </Card>
  );
}

export function ErrorState({ message }) {
  return (
    <Card className="border-red-100 bg-red-50 p-5 text-sm font-bold text-red-700">
      {message}
    </Card>
  );
}
