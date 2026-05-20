"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Package, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/StateViews";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, Td, Th } from "@/components/ui/table";
import { apiRequest } from "@/lib/apiClient";

const initial = { packageId: "", name: "", dataLimit: "", price: "" };

export function PackagesClient() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initial);
  const query = useMemo(() => new URLSearchParams({ q, page: "1", limit: "50" }).toString(), [q]);

  const load = useCallback(async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest(`/api/packages?${query}`);
      setItems(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { load(); }, [load]);

  async function create(event) {
    event.preventDefault();
    try {
      await apiRequest("/api/packages", { method: "POST", body: JSON.stringify({ ...form, price: Number(form.price) }) });
      toast.success("Package created");
      setForm(initial);
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function remove(id) {
    await apiRequest(`/api/packages/${id}`, { method: "DELETE" });
    toast.success("Package deleted");
    load();
  }

  return (
    <>
      <PageHeader icon={Package} title="Service Packages" description="Configure plan catalogue and activation package pricing." action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Create Package</Button>} />
      <Card className="mb-6 p-5">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input className="pl-10" placeholder="Search package name or package ID" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>
      {error ? <ErrorState message={error} /> : loading ? <LoadingState /> : items.length === 0 ? <EmptyState title="No packages found" description="Create the first service package for activations." /> : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <thead className="bg-neutral-50"><tr><Th>Package ID</Th><Th>Name</Th><Th>Data Limit</Th><Th>Price</Th><Th /></tr></thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <Td className="font-black text-neutral-900">{item.packageId}</Td>
                    <Td>{item.name}</Td>
                    <Td>{item.dataLimit}</Td>
                    <Td className="font-black">${Number(item.price).toFixed(2)}</Td>
                    <Td className="text-right"><Button variant="danger" size="icon" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4" /></Button></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
      <Dialog open={open} onOpenChange={setOpen} title="Create Package">
        <form onSubmit={create} className="space-y-4">
          <Input placeholder="Package ID" value={form.packageId} onChange={(e) => setForm({ ...form, packageId: e.target.value })} required />
          <Input placeholder="Package name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input placeholder="Data limit e.g. 20GB" value={form.dataLimit} onChange={(e) => setForm({ ...form, dataLimit: e.target.value })} required />
          <Input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <Button className="w-full" type="submit">Create Package</Button>
        </form>
      </Dialog>
    </>
  );
}
