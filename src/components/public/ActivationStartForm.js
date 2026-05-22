"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/apiClient";

export function ActivationStartForm() {
  const router = useRouter();
  const [simNumber, setSimNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState("");

  async function submit(event) {
    event.preventDefault();
    const value = simNumber.trim();
    setInlineError("");
    if (!/^\d{6,20}$/.test(value)) {
      setInlineError("Enter a valid numeric SIM number.");
      return;
    }
    setLoading(true);
    try {
      await apiRequest(`/api/public/sims/check?simNumber=${encodeURIComponent(value)}`);
      router.push(`/activate/${value}`);
    } catch (error) {
      setInlineError(error.message);
      if (error.message !== "This SIM is already activated.") toast.error(error.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-3 ">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={simNumber}
            onChange={(event) => {
              setInlineError("");
              setSimNumber(event.target.value.replace(/\D/g, ""));
            }}
            placeholder="Enter SIM number"
            className="h-12 flex-1 border-0 bg-slate-50 text-base focus:bg-white"
          />
          <Button size="lg" className="h-12" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Activation"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        {inlineError ? <p className="mt-2 px-1 text-sm font-medium text-red-600">{inlineError}</p> : null}
      </div>
    </form>
  );
}
