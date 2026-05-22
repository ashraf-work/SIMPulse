"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Shield, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Activate", href: "/" },
  { label: "Status", href: "/status" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" }
];

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="rounded-lg bg-slate-950 p-2 text-red-500 transition-colors group-hover:bg-slate-800">
            <Shield className="h-5 w-5 fill-current" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-semibold tracking-tight text-slate-950">SIMPULSE</span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Activator</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all duration-200",
                  active ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button className="rounded-lg p-2 text-slate-900 transition hover:bg-slate-100 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="absolute left-0 right-0 top-16 border-b border-slate-200 bg-white p-4 shadow-xl lg:hidden">
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
