"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileUp, Plus, RadioTower, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/StateViews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, Td, Th } from "@/components/ui/table";
import { apiRequest } from "@/lib/apiClient";

const initialForm = { simNumber: "", networkChannel: "", assignedScheme: "", status: "available" };

export function SimsClient() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ q: "", network: "", scheme: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const query = useMemo(() => new URLSearchParams({ ...filters, page: "1", limit: "50" }).toString(), [filters]);

  const load = useCallback(async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest(`/api/sims?${query}`);
      setItems(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  async function create(event) {
    event.preventDefault();
    try {
      await apiRequest("/api/sims", { method: "POST", body: JSON.stringify(form) });
      toast.success("SIM added");
      setOpen(false);
      setForm(initialForm);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function remove(id) {
    await apiRequest(`/api/sims/${id}`, { method: "DELETE" });
    toast.success("SIM deleted");
    load();
  }

  async function bulkUpload(file) {
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const sims = lines.slice(lines[0].toLowerCase().includes("simnumber") ? 1 : 0).map((line) => {
      const [simNumber, networkChannel, assignedScheme, status = "available"] = line.split(",").map((v) => v.trim());
      return { simNumber, networkChannel, assignedScheme, status };
    });
    try {
      await apiRequest("/api/sims/bulk", { method: "POST", body: JSON.stringify({ sims }) });
      toast.success("CSV uploaded");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <PageHeader
        icon={RadioTower}
        title="SIM Inventory"
        description="Manage network SIM registry, schemes and activation status."
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add SIM</Button>}
      />
      <Card className="mb-6 p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input className="pl-10" placeholder="Search serial number" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
          </div>
          <Input placeholder="Network" value={filters.network} onChange={(e) => setFilters({ ...filters, network: e.target.value })} />
          <Input placeholder="Scheme" value={filters.scheme} onChange={(e) => setFilters({ ...filters, scheme: e.target.value })} />
        </div>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-red-500">
          <FileUp className="h-4 w-4" />
          Bulk CSV Upload
          <input type="file" accept=".csv" className="hidden" onChange={(e) => bulkUpload(e.target.files?.[0])} />
        </label>
      </Card>
      {error ? <ErrorState message={error} /> : loading ? <LoadingState /> : items.length === 0 ? <EmptyState title="No SIMs found" description="Add a SIM or upload a CSV to populate inventory." /> : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <thead className="bg-neutral-50">
                <tr><Th>SIM Number</Th><Th>Network</Th><Th>Scheme</Th><Th>Status</Th><Th /></tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <Td className="font-black text-neutral-900">{item.simNumber}</Td>
                    <Td>{item.networkChannel}</Td>
                    <Td>{item.assignedScheme}</Td>
                    <Td><Badge tone={item.status}>{item.status}</Badge></Td>
                    <Td className="text-right"><Button variant="danger" size="icon" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4" /></Button></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
      <Dialog open={open} onOpenChange={setOpen} title="Add New SIM">
        <form onSubmit={create} className="space-y-4">
          <Input placeholder="SIM number" value={form.simNumber} onChange={(e) => setForm({ ...form, simNumber: e.target.value })} required />
          <Input placeholder="Network channel" value={form.networkChannel} onChange={(e) => setForm({ ...form, networkChannel: e.target.value })} required />
          <Input placeholder="Assigned scheme" value={form.assignedScheme} onChange={(e) => setForm({ ...form, assignedScheme: e.target.value })} required />
          <select className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-bold" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="available">Available</option>
            <option value="activated">Activated</option>
          </select>
          <Button className="w-full" type="submit">Create SIM</Button>
        </form>
      </Dialog>
    </>
  );
}
