import Link from "next/link";
import { Shield } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-14 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-lg bg-red-500/10 p-2 text-red-400">
                <Shield className="h-5 w-5 fill-current" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-white">SIMPULSE</span>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-400">
              Secure mobile connectivity activation for retail partners, support teams and customers who need fast status visibility.
            </p>
          </div>
          <FooterColumn title="Service" links={[["Help Center", "/contact"], ["Services", "/services"], ["Status Tracking", "/status"]]} />
          <FooterColumn title="Explore" links={[["Activate", "/"], ["About Us", "/about"]]} />
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <span className="font-semibold uppercase tracking-wider">Secured Activation Network</span>
          <span>© 2026 SimPulse. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">{title}</h4>
      <ul className="space-y-3 text-sm">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="text-slate-400 transition hover:text-red-400">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
