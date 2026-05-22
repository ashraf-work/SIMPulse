import { FeatureCard } from "@/components/public/FeatureCard";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeader } from "@/components/public/SectionHeader";

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="border-b border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="About SimPulse" title="A secure activation layer for mobile connectivity operations." description="SimPulse connects customer-facing activation intake with the admin workflow that reviews, approves and activates every request." />
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <FeatureCard title="Efficiency" description="Reduce manual intake and keep activation data structured from the first customer interaction." />
          <FeatureCard title="Security" description="Separate public-safe responses from admin-only session, token and internal operational fields." />
          <FeatureCard title="Reliability" description="Track each request from pending review through activation or rejection with one shared backend." />
        </div>
      </section>
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300/60 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400">Our promise</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight">Activation visibility for customers, operational control for admins.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Every public activation request becomes an admin dashboard request, so support teams and customers stay aligned without exposing sensitive admin data.
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
