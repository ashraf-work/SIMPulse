import { Boxes, CheckCircle2, Globe2, Lock, RadioTower, SearchCheck } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeader } from "@/components/public/SectionHeader";
import { ServiceCard } from "@/components/public/ServiceCard";

const services = [
  [CheckCircle2, "Instant Activation", "Submit validated activation requests through a guided public flow."],
  [Globe2, "Global Roaming", "Support roaming-ready customer operations across provider networks."],
  [Lock, "Secure Processing", "Keep admin-only data protected while customers track safe request fields."],
  [Boxes, "Bulk Management", "Admin teams can manage SIM inventory and package-backed provisioning."],
  [RadioTower, "Network Checks", "Keep operational visibility across SIM registry and activation states."],
  [SearchCheck, "Status Tracking", "Customers can check progress with reference ID or SIM number."]
];

export default function ServicesPage() {
  return (
    <PublicShell>
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Services" title="Activation infrastructure for modern connectivity teams." description="A focused set of public and admin workflows for SIM activation operations." />
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([Icon, title, description]) => (
            <ServiceCard key={title} icon={Icon} title={title} description={description} />
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
