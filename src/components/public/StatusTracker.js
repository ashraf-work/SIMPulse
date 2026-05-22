"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/apiClient";

export function StatusTracker() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [result, setResult] = useState(null);
  const [empty, setEmpty] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkStatus(value = query) {
    const term = value.trim();
    if (term.length < 3) {
      toast.error("Enter a reference ID or SIM number.");
      return;
    }
    setLoading(true);
    setEmpty("");
    setResult(null);
    try {
      const data = await apiRequest(`/api/public/status?query=${encodeURIComponent(term)}`);
      setResult(data);
    } catch (error) {
      setEmpty(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initial = searchParams.get("query");
    if (initial) checkStatus(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-5">
      <form onSubmit={(event) => { event.preventDefault(); checkStatus(); }} className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="h-12 border-0 bg-slate-50 pl-9 text-base focus:bg-white" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Reference ID or SIM number" />
          </div>
          <Button size="lg" className="h-12" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check Progress"}
          </Button>
        </div>
      </form>

      {loading ? <Card className="space-y-3 p-5"><div className="h-10 animate-pulse rounded-lg bg-slate-100" /><div className="h-10 animate-pulse rounded-lg bg-slate-100" /></Card> : null}

      {empty ? (
        <Card className="border-amber-200 bg-amber-50 p-5 text-sm font-medium text-amber-800">{empty}</Card>
      ) : null}

      {result ? (
        <Card className="p-5">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Reference ID</p>
              <p className="font-mono text-lg font-semibold text-slate-950">{result.referenceId}</p>
            </div>
            <StatusBadge status={result.status} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Info label="SIM number" value={result.simNumber} />
            <Info label="Created" value={new Date(result.createdAt).toLocaleString()} />
            <Info label="Source" value={result.source} />
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
