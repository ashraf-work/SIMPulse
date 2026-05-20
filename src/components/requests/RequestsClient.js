"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, Inbox, PlayCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/StateViews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Table, Td, Th } from "@/components/ui/table";
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

  return (
    <>
      <PageHeader icon={Inbox} title="Activation Requests" description="Review customer requests and control approval, activation and rejection workflow." />
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button key={item} onClick={() => setStatus(item)} className={cn("rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-widest transition", status === item ? "bg-red-500 text-white shadow-lg shadow-red-500/15" : "bg-white text-neutral-500 hover:bg-neutral-100")}>
            {item}
          </button>
        ))}
      </div>
      {error ? <ErrorState message={error} /> : loading ? <LoadingState /> : items.length === 0 ? <EmptyState title="No requests found" description="Requests matching this status will appear here." /> : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <thead className="bg-neutral-50"><tr><Th>Customer</Th><Th>SIM</Th><Th>Provider</Th><Th>Request ID</Th><Th>Status</Th><Th /></tr></thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <Td><p className="font-black text-neutral-900">{item.customerName}</p><p className="text-xs text-neutral-400">{item.email}</p></Td>
                    <Td>{item.simNumber}</Td>
                    <Td>{item.provider}</Td>
                    <Td className="font-mono text-xs">{item.requestId}</Td>
                    <Td><Badge tone={item.status}>{item.status}</Badge></Td>
                    <Td className="text-right"><Button variant="outline" size="sm" onClick={() => setSelected(item)}><Eye className="h-4 w-4" /> View</Button></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
      <Dialog open={Boolean(selected)} onOpenChange={() => setSelected(null)} title="Request Details">
        {selected ? (
          <div className="space-y-4">
            {["customerName", "email", "phone", "simNumber", "provider", "requestId"].map((key) => (
              <div key={key} className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{key}</p>
                <p className="mt-1 font-black text-neutral-900">{selected[key]}</p>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" onClick={() => transition(selected.id, "approve")}><CheckCircle2 className="h-4 w-4" /> Approve</Button>
              <Button onClick={() => transition(selected.id, "activate")}><PlayCircle className="h-4 w-4" /> Activate</Button>
              <Button variant="danger" onClick={() => transition(selected.id, "reject")}><XCircle className="h-4 w-4" /> Reject</Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}
