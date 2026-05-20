"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock, Shield } from "lucide-react";
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
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 rounded-3xl bg-red-500 p-4 text-white shadow-xl shadow-red-500/20">
            <Shield className="h-9 w-9 fill-current" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tight text-white">SIMPulse</h1>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Admin Ops</p>
        </div>
        <form onSubmit={submit} className="rounded-[2rem] border border-white/10 bg-white p-7 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-neutral-900">Secure Login</h2>
            <p className="text-sm font-medium text-neutral-500">Authorize access to activation controls.</p>
          </div>
          <div className="space-y-4">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <div className="relative">
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="pl-12" />
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>
          <Button className="mt-6 w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}
