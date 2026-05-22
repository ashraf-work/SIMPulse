import { Mail, MapPin, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/public/ContactForm";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeader } from "@/components/public/SectionHeader";

export default function ContactPage() {
  return (
    <PublicShell>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
        <div>
          <SectionHeader align="left" eyebrow="Contact" title="Need activation support?" description="Send a message to the support team. Contact submissions are stored in the database for follow-up." />
          <div className="space-y-3">
            <Info icon={Mail} title="Support email" value="support@simpulse.net" />
            <Info icon={MessageSquare} title="Response type" value="Activation and status support" />
            <Info icon={MapPin} title="Coverage" value="Retail and partner operations" />
          </div>
        </div>
        <ContactForm />
      </section>
    </PublicShell>
  );
}

function Info({ icon: Icon, title, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <span className="rounded-lg bg-red-50 p-2 text-red-500"><Icon className="h-5 w-5" /></span>
      <div>
        <p className="text-sm font-semibold text-slate-950">{title}</p>
        <p className="text-sm text-slate-500">{value}</p>
      </div>
    </div>
  );
}
