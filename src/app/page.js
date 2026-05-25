import {
  Activity,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  Globe2,
  Lock,
  MapPin,
  RadioTower,
  SearchCheck,
  ShieldCheck,
  Store,
} from "lucide-react";
import Link from "next/link";
import { ActivationStartForm } from "@/components/public/ActivationStartForm";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeader } from "@/components/public/SectionHeader";
import { ServiceCard } from "@/components/public/ServiceCard";

const carrierLogos = [
  "T-Mobile",
  "Verizon",
  "AT&T",
  "Vodafone",
  "Orange",
  "O2",
];

const features = [
  [
    Clock,
    "Instant Intake",
    "Start a validated request with only a SIM number, then finish customer details in a focused activation flow.",
  ],
  [
    Lock,
    "Secure Processing",
    "Public APIs expose only safe status fields while admin sessions and internal tokens stay protected.",
  ],
  [
    SearchCheck,
    "Live Status Tracking",
    "Customers can track progress by reference ID or SIM number after admin teams update the request.",
  ],
];

const steps = [
  [
    "01",
    "Enter SIM number",
    "The system checks inventory first, so invalid and already activated SIMs stop before the form.",
  ],
  [
    "02",
    "Submit customer details",
    "Name, email, phone and source are captured with validation and linked to the same SIM.",
  ],
  [
    "03",
    "Track activation",
    "The created request appears in admin operations and public status reflects the latest state.",
  ],
];

const regions = [
  "United States",
  "United Kingdom",
  "Canada",
  "Europe",
  "Middle East",
  "Asia Pacific",
];
const partners = [
  "Retail counters",
  "Amazon sellers",
  "eBay stores",
  "Partner outlets",
  "Support desks",
  "Other Retailers",
];

export default function HomePage() {
  return (
    <PublicShell>
      <HomeHero />
      <CarrierStrip />
      <FeatureSection />
      <HowItWorks />
      <SystemStatus />
      <SupportedRegions />
      <TrustedPartners />
    </PublicShell>
  );
}

function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.10),transparent_34%),linear-gradient(180deg,#ffffff,rgba(248,250,252,.78))]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        {/* LEFT — Info + Stats */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="mb-4 inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-600">
            Secured Activation Network
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            Activate your SIM with secure realtime tracking.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            Verified by inventory, tracked in real time — built for retail
            counters, online sellers, and support desks worldwide.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
            {[
              "Inventory checked first",
              "One SIM, one user",
              "Admin linked status",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — Form Panel */}
        <div className="grid content-center">
          <div className="rounded-2xl bg-slate-950 p-6 text-white">
            <h2 className="text-lg font-semibold text-white">
              Start activation
            </h2>
            <p className="mt-1 mb-5 text-sm text-slate-400">
              Enter your SIM number to check availability and begin.
            </p>

            <ActivationStartForm />

            <div className="my-5" />

            {[
              [ShieldCheck, "Secure end-to-end processing"],
              [Activity, "Live status updates via admin dashboard"],
              [MapPin, "Available across 6 global regions"],
            ].map(([Icon, text]) => (
              <div
                key={text}
                className="flex items-center gap-3 py-2.5 border-b border-white/[0.08] last:border-none"
              >
                <Icon className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-sm text-slate-300">{text}</p>
              </div>
            ))}

            <div className="mt-5 pt-4 text-center text-xs text-slate-500">
              Already submitted?{" "}
              <Link href="/status" className="text-red-400 hover:underline">
                Track by reference ID Or SIM number{" "}
                <ArrowRight className="h-3 w-3 inline-block" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CarrierStrip() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Compatible carrier operations
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {carrierLogos.map((carrier) => (
            <div
              key={carrier}
              className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600"
            >
              {carrier}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Core features"
        title="Designed for public intake and admin control."
        description="The public website validates requests while the admin dashboard keeps operational ownership."
      />
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {features.map(([Icon, title, description]) => (
          <ServiceCard
            key={title}
            icon={Icon}
            title={title}
            description={description}
          />
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Activation flow"
        title="How it works"
        description="Every request follows a simple, auditable path from public submission to admin-managed status."
      />
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {steps.map(([number, title, description]) => (
          <div
            key={number}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70"
          >
            <span className="mb-5 inline-flex rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-red-400">
              {number}
            </span>
            <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SystemStatus() {
  const items = [
    ["Activation API", "Operational", Activity],
    ["SIM Registry", "Synced", Boxes],
    ["Status Tracker", "Available", SearchCheck],
    ["Security Layer", "Protected", ShieldCheck],
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/60 md:p-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-400">
              System status
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Activation infrastructure is live.
            </h2>
          </div>
          <Link
            href="/status"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-red-50"
          >
            Check status <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {items.map(([label, state, Icon]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]"
            >
              <Icon className="mb-4 h-5 w-5 text-red-400" />
              <p className="font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-emerald-400">{state}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportedRegions() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Supported regions"
        title="Regional activation support for distributed teams."
      />
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => (
          <div
            key={region}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
          >
            <span className="rounded-lg bg-red-50 p-2 text-red-500">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="font-semibold text-slate-800">{region}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustedPartners() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 ">
        <div className="text-center">
          <SectionHeader
            eyebrow="Trusted partners"
            title="Built for carrier retail workflows"                                                        
          />                                                                                    
          <p className="-mt-8 leading-7 text-slate-600">
            Public activation captures source details so admin teams know where
            the request originated.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ">
          {partners.map((partner) => (
            <div
              key={partner}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70"
            >
              <Store className="mb-4 h-5 w-5 text-red-500 transition group-hover:scale-110" />
              <p className="font-semibold text-slate-950">{partner}</p>
              <p className="mt-2 text-sm text-slate-600">
                Source-aware activation request handling.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
