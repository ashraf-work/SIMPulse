import { ActivationForm } from "@/components/public/ActivationForm";
import { PublicShell } from "@/components/public/PublicShell";

export default async function ActivatePage({ params }) {
  const { simNumber } = await params;
  return (
    <PublicShell>
      <section className="mx-auto min-h-[90vh] grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-red-500">Activation</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Complete your activation request</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Add customer details and submit the request. Your reference ID will appear after successful submission.
          </p>
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Selected SIM: <span className="font-mono font-semibold text-slate-950">{simNumber}</span>
          </div>
        </div>
        <ActivationForm initialSimNumber={simNumber} />
      </section>
    </PublicShell>
  );
}
