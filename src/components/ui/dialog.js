"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Dialog({ open, onOpenChange, title, children, className }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className={cn("w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl", className)}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black text-neutral-900">{title}</h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Close dialog">
            <X className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
