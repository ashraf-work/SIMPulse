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
    <div className="min-h-screen bg-slate-50 md:flex">
      <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950 px-4 md:hidden">
        <Brand compact />
        <button className="rounded-lg p-2 text-white transition hover:bg-white/10" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open ? <button className="fixed inset-0 z-30 bg-slate-950/50 md:hidden" onClick={() => setOpen(false)} aria-label="Close menu" /> : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950 shadow-2xl transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="hidden border-b border-white/10 p-6 md:block">
          <Brand />
        </div>

        <nav className="flex-1 space-y-1.5 p-4 pt-20 md:pt-4">
          {navItems.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3.5 py-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-red-500 text-white shadow-lg shadow-red-950/30"
                    : "text-slate-400 hover:bg-white/8 hover:text-white"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className={cn("h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110", active ? "text-white" : "text-slate-500")} />
                  {item.name}
                </span>
                {active ? <ChevronRight className="h-4 w-4 opacity-70" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15 text-sm font-semibold uppercase text-red-400">
                {admin?.email?.[0] || "A"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{admin?.name || "Admin"}</p>
                <p className="truncate text-xs text-slate-500">{admin?.email || "admin@simpulse.net"}</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="group flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-[18px] w-[18px] transition-transform duration-200 group-hover:-translate-x-0.5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden p-4 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-red-500 p-2 text-white shadow-lg shadow-red-950/30">
        <Shield className={cn("fill-current", compact ? "h-5 w-5" : "h-6 w-6")} />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold uppercase tracking-tight text-white">SIMPulse</span>
        {!compact ? <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400">Admin Ops</span> : null}
      </div>
    </div>
  );
}
