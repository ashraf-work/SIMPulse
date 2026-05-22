"use client";

import { ChevronDown, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select option",
  error = false,
  disabled = false,
  className
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);

  useEffect(() => {
    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const index = Math.max(options.findIndex((option) => option.value === value), 0);
    setActiveIndex(index);
  }, [open, options, value]);

  function choose(option) {
    onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onKeyDown(event) {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) setOpen(true);
      else choose(options[activeIndex]);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, options.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Escape") setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onKeyDown}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-3 rounded-lg border bg-white px-3 text-left text-sm font-medium outline-none transition duration-200 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
          error ? "border-red-300 text-red-700 focus:border-red-500 focus:ring-red-500/10" : "border-slate-200 text-slate-800 focus:border-red-500 focus:ring-red-500/10"
        )}
      >
        <span className={cn("truncate", !selected && "text-slate-400")}>{selected?.label || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute z-[120] mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10">
          <div role="listbox" tabIndex={-1}>
            {options.map((option, index) => {
              const active = index === activeIndex;
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(option)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    active ? "bg-slate-100 text-slate-950" : "text-slate-600",
                    isSelected && "font-semibold text-red-600"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? <Check className="h-4 w-4" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
