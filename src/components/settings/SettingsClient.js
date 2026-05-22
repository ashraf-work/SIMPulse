"use client";

import { useEffect, useState } from "react";
import { Mail, Save, Settings, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState, LoadingSkeleton } from "@/components/common/StateViews";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/apiClient";

export function SettingsClient() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/api/settings")
      .then(setForm)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      setForm(await apiRequest("/api/settings", { method: "PUT", body: JSON.stringify(form) }));
      toast.success("Settings updated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (error) return <ErrorState message={error} />;
  if (loading || !form) return <LoadingSkeleton rows={7} />;

  return (
    <section className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageHeader icon={Settings} title="System Configuration" description="Manage global application settings and security." />
      <form onSubmit={submit} className="space-y-5">
        <Card className="space-y-5 p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-slate-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Platform Identity</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Business name">
              <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
            </FormField>
            <FormField label="Support email">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" type="email" value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
              </div>
            </FormField>
          </div>
        </Card>

        <Card className="space-y-3 p-5">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-slate-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Operating Procedures</h2>
          </div>
          <ToggleRow title="Instant Auto-Activation" description="Process requests without manual review" checked={form.autoActivation} onChange={(value) => setForm({ ...form, autoActivation: value })} />
          <ToggleRow title="Maintenance Mode" description="Lock public activation portal for upgrades" checked={form.maintenanceMode} onChange={(value) => setForm({ ...form, maintenanceMode: value })} danger />
        </Card>

        <div className="flex justify-end">
          <Button variant="dark" size="lg" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Deploying..." : "Deploy Configuration"}
          </Button>
        </div>
      </form>

      {/* <Card className="mt-6 border-slate-800 bg-slate-950 p-5 text-white">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Security Infrastructure</h3>
        <div className="space-y-3 font-mono text-xs text-slate-400">
          <p className="flex justify-between gap-4"><span>Storage Engine</span><span className="text-red-400">MongoDB + Mongoose</span></p>
          <p className="flex justify-between gap-4"><span>Identity Provider</span><span className="text-red-400">JWT Session Cookie</span></p>
          <p className="flex justify-between gap-4"><span>Last Handshake</span><span>{new Date().toISOString()}</span></p>
        </div>
      </Card> */}
    </section>
  );
}

function ToggleRow({ title, description, checked, onChange, danger = false }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:bg-white">
      <div>
        <p className={`text-sm font-semibold ${danger ? "text-red-600" : "text-slate-950"}`}>{title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
