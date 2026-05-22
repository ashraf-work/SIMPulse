"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Dialog({ open, onOpenChange, title, description, children, footer, className }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-150 items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className={cn("w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 rounded-xl border border-slate-200 bg-white shadow-2xl", className)}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          <Button variant="ghost" size="icon" className="-mr-2 -mt-2" onClick={() => onOpenChange(false)} aria-label="Close dialog">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer ? <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
