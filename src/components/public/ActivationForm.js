"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { CustomSelect } from "@/components/common/CustomSelect";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/apiClient";

export function ActivationForm({ initialSimNumber }) {
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    simNumber: initialSimNumber || "",
    source: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  function validate() {
    const nextErrors = {};
    if (form.customerName.trim().length < 2) nextErrors.customerName = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email.";
    if (form.phone.trim().length < 7) nextErrors.phone = "Phone number is required.";
    if (form.address.trim().length < 5) nextErrors.address = "Address is required.";
    if (!/^\d{6,20}$/.test(form.simNumber)) nextErrors.simNumber = "SIM number must be numeric.";
    if (!form.source) nextErrors.source = "Select an activation source.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await apiRequest("/api/public/activation", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setSuccess(result);
      toast.success("Activation request submitted");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} className="space-y-4  rounded-xl border border-slate-200 bg-white h-fit p-5 shadow-sm">
        <FormField label="Customer name" error={errors.customerName}>
          <Input value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} placeholder="Your full name" />
        </FormField>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Email" error={errors.email}>
            <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
          </FormField>
          <FormField label="Phone" error={errors.phone}>
            <Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+1 555 0100" />
          </FormField>
        </div>
        <FormField label="Address" error={errors.address}>
          <Input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Street, city, state" />
        </FormField>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="SIM number" error={errors.simNumber}>
            <Input value={form.simNumber} onChange={(event) => setForm({ ...form, simNumber: event.target.value.replace(/\D/g, "") })} />
          </FormField>
          <FormField label="Source" error={errors.source}>
            <CustomSelect
              value={form.source}
              onChange={(value) => setForm({ ...form, source: value })}
              placeholder="Select source"
              error={Boolean(errors.source)}
              options={[
                { value: "Direct", label: "Direct" },
                { value: "Amazon", label: "Amazon" },
                { value: "eBay", label: "eBay" },
                { value: "Retail Store", label: "Retail Store" },
                { value: "Partner Outlet", label: "Partner Outlet" }
              ]}
            />
          </FormField>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Activation Request"}
        </Button>
      </form>

      <Dialog
        open={Boolean(success)}
        onOpenChange={() => setSuccess(null)}
        title="Activation request received"
        description="Your request is now visible to the admin activation team."
      >
        {success ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">Reference ID: {success.referenceId}</p>
                <p className="mt-1 text-sm">Track progress with this reference ID or SIM number.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSuccess(null)}>Close</Button>
              <Link
                href={`/status?query=${encodeURIComponent(success.referenceId)}`}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-red-500 px-4 text-sm font-semibold text-white shadow-sm shadow-red-500/20 transition-all duration-200 hover:bg-red-600 hover:shadow-md"
              >
                Track Status
              </Link>
            </div>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}
