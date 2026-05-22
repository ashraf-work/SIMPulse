"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Package, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DataTable } from "@/components/common/DataTable";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/StateViews";
import { FormField } from "@/components/common/FormField";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/apiClient";

const initial = { packageId: "", name: "", dataLimit: "", price: "" };

export function PackagesClient() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initial);
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
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

  function validate() {
    const errors = {};
    if (form.packageId.trim().length < 2) errors.packageId = "Package ID is required.";
    if (form.name.trim().length < 2) errors.name = "Package name is required.";
    if (form.dataLimit.trim().length < 1) errors.dataLimit = "Data limit is required.";
    if (!form.price || Number(form.price) < 0) errors.price = "Enter a valid package price.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function create(event) {
    event.preventDefault();
    if (!validate()) return;
    try {
      await apiRequest("/api/packages", { method: "POST", body: JSON.stringify({ ...form, price: Number(form.price) }) });
      toast.success("Package created");
      setForm(initial);
      setFormErrors({});
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function remove() {
    if (!deleteTarget) return;
    await apiRequest(`/api/packages/${deleteTarget._id}`, { method: "DELETE" });
    toast.success("Package deleted");
    setDeleteTarget(null);
    load();
  }

  const columns = [
    { key: "packageId", header: "Package ID", render: (row) => <span className="font-semibold text-slate-950">{row.packageId}</span> },
    { key: "name", header: "Name" },
    { key: "dataLimit", header: "Data Limit" },
    { key: "price", header: "Price", render: (row) => `$${Number(row.price).toFixed(2)}` },
    { key: "actions", header: "", cellClassName: "text-right", render: (row) => <Button variant="danger" size="icon" onClick={() => setDeleteTarget(row)}><Trash2 className="h-4 w-4" /></Button> }
  ];

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageHeader
        icon={Package}
        title="Service Packages"
        description="Configure package catalogue and activation pricing."
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Create Package</Button>}
      />

      <Card className="mb-5 p-4">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Search package name or package ID" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>

      {error ? <ErrorState message={error} /> : loading ? <LoadingSkeleton rows={6} /> : items.length === 0 ? <EmptyState title="No packages found" description="Create the first service package for activations." /> : (
        <DataTable rows={items} columns={columns} getRowKey={(row) => row._id} />
      )}

      <Dialog open={open} onOpenChange={setOpen} title="Create Package" description="Packages become selectable when creating SIM inventory.">
        <form onSubmit={create} className="space-y-4">
          <FormField label="Package ID" error={formErrors.packageId}>
            <Input placeholder="TM-PRE-5G" value={form.packageId} onChange={(e) => setForm({ ...form, packageId: e.target.value })} />
          </FormField>
          <FormField label="Package name" error={formErrors.name}>
            <Input placeholder="T-Mobile 5G Premium" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Data limit" error={formErrors.dataLimit}>
            <Input placeholder="Unlimited" value={form.dataLimit} onChange={(e) => setForm({ ...form, dataLimit: e.target.value })} />
          </FormField>
          <FormField label="Price" error={formErrors.price}>
            <Input type="number" step="0.01" placeholder="55" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Create Package</Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete package?"
        description={deleteTarget ? `Delete ${deleteTarget.name}.` : ""}
        confirmLabel="Delete Package"
        destructive
        onConfirm={remove}
      />
    </section>
  );
}
