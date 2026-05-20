"use client";

import { useEffect, useState } from "react";
import { Activity, Box, Clock, Database, RadioTower, Server } from "lucide-react";
import { apiRequest } from "@/lib/apiClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingState, ErrorState } from "@/components/common/StateViews";
import { PageHeader } from "@/components/common/PageHeader";

export function DashboardClient() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/api/dashboard").then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState label="Syncing operations" />;

  const cards = [
    { label: "Total SIM Inventory", value: data.stats.totalSims, icon: Database },
    { label: "Activated SIM Count", value: data.stats.activatedSims, icon: RadioTower },
    { label: "Pending Requests", value: data.stats.pendingRequests, icon: Clock },
    { label: "Network Traffic", value: data.stats.totalRequests, icon: Activity }
  ];

  return (
    <>
      <PageHeader icon={Server} title="Operations Dashboard" description="Live SIM activation infrastructure and request overview." />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="rounded-2xl bg-red-500/10 p-3 text-red-500">
                <card.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Live</span>
            </div>
            <p className="text-3xl font-black text-neutral-900">{card.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-neutral-400">{card.label}</p>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-5 text-lg font-black text-neutral-900">Recent Activation Requests</h2>
          <div className="space-y-3">
            {data.recentRequests.map((request) => (
              <div key={request.id} className="flex flex-col gap-3 rounded-2xl bg-neutral-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-black text-neutral-900">{request.customerName}</p>
                  <p className="text-xs font-semibold text-neutral-500">{request.requestId} - {request.simNumber}</p>
                </div>
                <Badge tone={request.status}>{request.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="mb-5 text-lg font-black text-neutral-900">Service Infrastructure</h2>
          <div className="space-y-4">
            {data.infrastructure.map((item) => (
              <div key={item.label} className="rounded-2xl border border-neutral-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-black text-neutral-900">{item.label}</p>
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-neutral-400">{item.status} - {item.latency}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
