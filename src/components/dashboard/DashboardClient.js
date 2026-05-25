"use client";

import { useEffect, useState } from "react";
import { Activity, Clock, Database, RadioTower, Server } from "lucide-react";
import { apiRequest } from "@/lib/apiClient";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/common/DataTable";
import { ErrorState, LoadingSkeleton } from "@/components/common/StateViews";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";

export function DashboardClient() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/api/dashboard").then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingSkeleton rows={7} />;

  const cards = [
    { label: "Total SIM Inventory", value: data.stats.totalSims, icon: Database },
    { label: "Activated SIMs", value: data.stats.activatedSims, icon: RadioTower },
    { label: "Pending Requests", value: data.stats.pendingRequests, icon: Clock },
    { label: "Network Traffic", value: data.stats.totalRequests, icon: Activity }
  ];

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageHeader icon={Server} title="Operations Dashboard" description="Live SIM activation infrastructure and request overview." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/70">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-red-50 p-2.5 text-red-500 transition duration-200 group-hover:bg-red-500 group-hover:text-white">
                <card.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Live</span>
            </div>
            <p className="text-2xl font-semibold text-slate-950">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            rows={data.recentRequests}
            getRowKey={(row) => row._id}
            columns={[
              { key: "customerName", header: "Customer", render: (row) => <div><p className="font-semibold text-slate-950">{row.customerName}</p><p className="text-xs text-slate-500">{row.email}</p></div> },
              { key: "simNumber", header: "SIM" },
              { key: "provider", header: "Source" },
              { key: "price", header: "Price" },
              { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> }
            ]}
          />
        </div>

        <Card className="p-5">
          <h2 className="mb-4 text-base font-semibold text-slate-950">Service Infrastructure</h2>
          <div className="space-y-3">
            {data.infrastructure.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.status} - {item.latency}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
