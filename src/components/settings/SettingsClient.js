"use client";

import { useEffect, useState } from "react";
import { Mail, Save, Settings, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState, LoadingState } from "@/components/common/StateViews";
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
  if (loading || !form) return <LoadingState label="Loading configuration" />;

  return (
    <div className="max-w-4xl">
      <PageHeader icon={Settings} title="System Configuration" description="Manage global application settings and security." />
      <form onSubmit={submit} className="space-y-6">
        <Card className="space-y-6 p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-neutral-400" />
            <h2 className="text-xs font-black uppercase italic tracking-widest text-neutral-400">Platform Identity</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="ml-1 text-[10px] font-black uppercase tracking-wider text-neutral-500">Business Name</span>
              <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
            </label>
            <label className="space-y-2">
              <span className="ml-1 text-[10px] font-black uppercase tracking-wider text-neutral-500">Support Email</span>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input className="pl-12" type="email" value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
              </div>
            </label>
          </div>
        </Card>
        <Card className="space-y-4 p-8">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-neutral-400" />
            <h2 className="text-xs font-black uppercase italic tracking-widest text-neutral-400">Operating Procedures</h2>
          </div>
          <ToggleRow title="Instant Auto-Activation" description="Process requests without manual review" checked={form.autoActivation} onChange={(value) => setForm({ ...form, autoActivation: value })} />
          <ToggleRow title="Maintenance Mode" description="Lock public activation portal for upgrades" checked={form.maintenanceMode} onChange={(value) => setForm({ ...form, maintenanceMode: value })} danger />
        </Card>
        <div className="flex justify-end">
          <Button variant="dark" size="lg" disabled={saving}>
            <Save className="h-5 w-5" />
            {saving ? "Deploying..." : "Deploy Configuration"}
          </Button>
        </div>
      </form>
      <div className="mt-8 rounded-[2rem] bg-neutral-900 p-8 text-white">
        <h3 className="mb-4 text-[10px] font-black uppercase italic tracking-[0.2em] text-neutral-500">Security Infrastructure</h3>
        <div className="space-y-3 font-mono text-[10px] text-neutral-400">
          <p className="flex justify-between"><span>Storage Engine:</span><span className="text-red-500">MongoDB + Mongoose</span></p>
          <p className="flex justify-between"><span>Identity Provider:</span><span className="text-red-500">JWT Session Cookie</span></p>
          <p className="flex justify-between"><span>Last Handshake:</span><span>{new Date().toISOString()}</span></p>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange, danger = false }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
      <div>
        <p className={`font-black ${danger ? "text-red-600" : "text-neutral-900"}`}>{title}</p>
        <p className="text-[10px] font-medium uppercase italic tracking-wide text-neutral-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
