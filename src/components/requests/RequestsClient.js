"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, Inbox, PlayCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/StateViews";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/apiClient";
import { cn } from "@/lib/utils";

const filters = ["all", "pending", "approved", "activated", "rejected"];

export function RequestsClient() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const query = useMemo(() => new URLSearchParams({ status, page: "1", limit: "50" }).toString(), [status]);

  const load = useCallback(async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest(`/api/requests?${query}`);
      setItems(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { load(); }, [load]);

  async function transition(id, action) {
    try {
      await apiRequest(`/api/requests/${id}/${action}`, { method: "PATCH", body: "{}" });
      toast.success(`Request ${action}d`);
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const columns = [
    { key: "customerName", header: "Customer", render: (row) => <div><p className="font-semibold text-slate-950">{row.customerName}</p><p className="text-xs text-slate-500">{row.email}</p></div> },
    { key: "simNumber", header: "SIM" },
    { key: "provider", header: "Source" },
    { key: "requestId", header: "Request ID", cellClassName: "font-mono text-xs" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "", cellClassName: "text-right", render: (row) => <Button variant="outline" size="sm" onClick={() => setSelected(row)}><Eye className="h-4 w-4" /> View</Button> }
  ];

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageHeader icon={Inbox} title="Activation Requests" description="Review requests and manage approval, activation and rejection workflow." />

      <Card className="mb-5 inline-flex flex-wrap gap-1 p-1">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setStatus(item)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-medium capitalize transition-all duration-200",
              status === item ? "bg-red-500 text-white shadow-sm shadow-red-500/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            )}
          >
            {item}
          </button>
        ))}
      </Card>

      {error ? <ErrorState message={error} /> : loading ? <LoadingSkeleton rows={6} /> : items.length === 0 ? <EmptyState title="No requests found" description="Requests matching this status will appear here." /> : (
        <DataTable rows={items} columns={columns} getRowKey={(row) => row._id} />
      )}

      <Dialog open={Boolean(selected)} onOpenChange={() => setSelected(null)} title="Request Details" description="Customer and SIM activation information.">
        {selected ? (
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["Customer", selected.customerName],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["SIM Number", selected.simNumber],
                ["Source", selected.provider],
                ["Request ID", selected.requestId]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <span className="text-sm font-medium text-slate-600">Current status</span>
              <StatusBadge status={selected.status} />
            </div>
            <div className="flex flex-wrap justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => transition(selected._id, "approve")}><CheckCircle2 className="h-4 w-4" /> Approve</Button>
              <Button onClick={() => transition(selected._id, "activate")}><PlayCircle className="h-4 w-4" /> Activate</Button>
              <Button variant="danger" onClick={() => transition(selected._id, "reject")}><XCircle className="h-4 w-4" /> Reject</Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </section>
  );
}
