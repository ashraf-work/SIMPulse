"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileUp, Plus, RadioTower, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { CustomSelect } from "@/components/common/CustomSelect";
import { DataTable } from "@/components/common/DataTable";
import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
} from "@/components/common/StateViews";
import { FormField } from "@/components/common/FormField";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/apiClient";

const initialForm = { simNumber: "", carrierId: "" };

export function SimsClient() {
  const [items, setItems] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    carrierId: "",
    status: "all",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const query = useMemo(
    () =>
      new URLSearchParams({ ...filters, page: "1", limit: "50" }).toString(),
    [filters],
  );

  const load = useCallback(
    async function load() {
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
    },
    [query],
  );

  const loadCarriers = useCallback(async function loadCarriers() {
    const data = await apiRequest("/api/packages?page=1&limit=100");
    setCarriers(data.items);
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    loadCarriers().catch((err) => toast.error(err.message));
  }, [loadCarriers]);

  function validate() {
    const errors = {};
    if (form.simNumber.trim().length < 3)
      errors.simNumber = "SIM number must be at least 3 characters.";
    if (!form.carrierId) errors.carrierId = "Select a carrier.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function create(event) {
    event.preventDefault();
    if (!validate()) return;
    try {
      await apiRequest("/api/sims", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("SIM added");
      setOpen(false);
      setForm(initialForm);
      setFormErrors({});
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function remove() {
    if (!deleteTarget) return;
    await apiRequest(`/api/sims/${deleteTarget._id}`, { method: "DELETE" });
    toast.success("SIM deleted");
    setDeleteTarget(null);
    load();
  }

  async function bulkUpload(file) {
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const sims = lines
      .slice(lines[0].toLowerCase().includes("simnumber") ? 1 : 0)
      .map((line) => {
        const [simNumber, carrierName] = line
          .split(",")
          .map((value) => value.trim());
        return { simNumber, carrierName };
      });
    try {
      await apiRequest("/api/sims/bulk", {
        method: "POST",
        body: JSON.stringify({ sims }),
      });
      toast.success("CSV uploaded");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const columns = [
    {
      key: "simNumber",
      header: "SIM Number",
      render: (row) => (
        <span className="font-semibold text-slate-950">{row.simNumber}</span>
      ),
    },
    {
      key: "carrierName",
      header: "Carrier",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.carrierName}</p>
          <p className="text-xs text-slate-500">{row.packageName}</p>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row) => `$${Number(row.price).toFixed(2)}`,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      cellClassName: "text-right",
      render: (row) => (
        <Button
          variant="danger"
          size="icon"
          onClick={() => setDeleteTarget(row)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];
  const carrierOptions = [
    { value: "", label: "All carriers" },
    ...carriers.map((carrier) => ({ value: carrier._id, label: carrier.carrierName })),
  ];
  const statusOptions = [
    { value: "all", label: "All status" },
    { value: "available", label: "Available" },
    { value: "activated", label: "Activated" },
  ];
  const formCarrierOptions = carriers.map((carrier) => ({
    value: carrier._id,
    label: `${carrier.carrierName} - ${carrier.name} - $${Number(carrier.price).toFixed(2)}`,
  }));

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
      <PageHeader
        icon={RadioTower}
        title="SIM Inventory"
        description="Manage SIM registry with carrier backed provisioning."
        action={
          <div className="flex items-center gap-6">
            <label className=" inline-flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-red-500">
              <FileUp className="h-4 w-4" />
              Bulk CSV Upload
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => bulkUpload(e.target.files?.[0])}
              />
            </label>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add SIM
            </Button>
          </div>
        }
      />

      <Card className="mb-5 p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search SIM number"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>
          <CustomSelect
            value={filters.carrierId}
            onChange={(value) => setFilters({ ...filters, carrierId: value })}
            options={carrierOptions}
          />
          <CustomSelect
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            options={statusOptions}
          />
        </div>
      </Card>

      {error ? (
        <ErrorState message={error} />
      ) : loading ? (
        <LoadingSkeleton rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No SIMs found"
          description="Add a SIM with a carrier to populate inventory."
        />
      ) : (
        <DataTable
          rows={items}
          columns={columns}
          getRowKey={(row) => row._id}
        />
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Add SIM"
        description="Select an existing carrier. Carrier details are snapshotted by the backend."
      >
        <form id="sim-form" onSubmit={create} className="space-y-4">
          <FormField label="SIM number" error={formErrors.simNumber}>
            <Input
              placeholder="03052111162"
              value={form.simNumber}
              onChange={(e) => setForm({ ...form, simNumber: e.target.value })}
            />
          </FormField>
          <FormField label="Carrier" error={formErrors.carrierId}>
            <CustomSelect
              value={form.carrierId}
              onChange={(value) => setForm({ ...form, carrierId: value })}
              options={formCarrierOptions}
              placeholder="Select carrier"
              error={Boolean(formErrors.carrierId)}
            />
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create SIM</Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete SIM?"
        description={
          deleteTarget ? `Delete ${deleteTarget.simNumber} from inventory.` : ""
        }
        confirmLabel="Delete SIM"
        destructive
        onConfirm={remove}
      />
    </section>
  );
}
