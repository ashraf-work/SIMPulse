import { Suspense } from "react";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeader } from "@/components/public/SectionHeader";
import { StatusTracker } from "@/components/public/StatusTracker";

export default function StatusPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 min-h-[60vh]">
        <SectionHeader eyebrow="Status tracking" title="Check activation progress." description="Use your reference ID or SIM number to see the latest admin-managed request status." />
        <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-slate-100" />}>
          <StatusTracker />
        </Suspense>
      </section>
    </PublicShell>
  );
}
