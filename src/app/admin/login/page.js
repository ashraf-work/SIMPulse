"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/apiClient";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "admin@simpulse.net", password: "password123" });
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
      toast.success("Admin session started");
      router.replace("/admin/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 rounded-xl bg-red-500 p-3 text-white shadow-lg shadow-red-950/30">
            <Shield className="h-8 w-8 fill-current" />
          </div>
          <h1 className="text-2xl font-semibold uppercase tracking-tight text-white">SIMPulse</h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-red-400">Admin Ops</p>
        </div>
        <form onSubmit={submit} className="rounded-xl border border-white/10 bg-white p-6 shadow-2xl">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-950">Secure Login</h2>
            <p className="mt-1 text-sm text-slate-500">Authorize access to activation controls.</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
          </div>
          <Button className="mt-5 w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}
