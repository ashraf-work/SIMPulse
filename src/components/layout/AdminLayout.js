"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Box,
  ChevronRight,
  LogOut,
  Menu,
  Package,
  RadioTower,
  Settings,
  Shield,
  X
} from "lucide-react";
import { apiRequest } from "@/lib/apiClient";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: BarChart3 },
  { name: "SIM Inventory", path: "/admin/sims", icon: RadioTower },
  { name: "Service Packages", path: "/admin/packages", icon: Package },
  { name: "Activation Requests", path: "/admin/requests", icon: Box },
  { name: "Settings", path: "/admin/settings", icon: Settings }
];

export function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    apiRequest("/api/auth/me")
      .then((data) => setAdmin(data.admin))
      .catch(() => router.replace("/admin/login"));
  }, [pathname, router]);

  async function logout() {
    await apiRequest("/api/auth/logout", { method: "POST", body: "{}" }).catch(() => {});
    router.replace("/admin/login");
  }

  if (pathname === "/admin/login") return children;

  return (
    <div className="min-h-screen bg-[#F8FAFC] md:flex">
      <div className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-white/5 bg-slate-900 px-6 md:hidden">
        <Brand compact />
        <button className="rounded-xl p-2 text-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? <button className="fixed inset-0 z-30 bg-slate-950/50 md:hidden" onClick={() => setOpen(false)} aria-label="Close menu" /> : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-900 shadow-2xl transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="hidden border-b border-white/5 p-8 md:block">
          <Brand />
        </div>
        <nav className="flex-1 space-y-2 p-6 pt-24 md:pt-6">
          {navItems.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-bold transition-all",
                  active ? "bg-red-500 text-white shadow-xl shadow-red-500/20" : "text-neutral-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="flex items-center gap-4">
                  <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", active ? "text-white" : "text-neutral-500")} />
                  {item.name}
                </span>
                {active ? <ChevronRight className="h-4 w-4 opacity-60" /> : null}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/5 p-6">
          <div className="mb-4 rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-xs font-black uppercase text-red-500">
                {admin?.email?.[0] || "A"}
              </div>
              <p className="truncate text-[10px] font-black uppercase tracking-widest text-neutral-500">
                {admin?.email || "admin@simpulse.net"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="group flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold text-neutral-500 transition-all hover:bg-red-400/5 hover:text-red-400"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden p-6 lg:p-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-red-500 p-2 text-white shadow-lg shadow-red-500/20">
        <Shield className={cn("fill-current", compact ? "h-5 w-5" : "h-6 w-6")} />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-black uppercase italic leading-none tracking-tight text-white">SIMPulse</span>
        {!compact ? <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">Admin Ops</span> : null}
      </div>
    </div>
  );
}
