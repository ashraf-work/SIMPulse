import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";

export function PublicShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <PublicHeader />
      <main className="relative overflow-hidden">{children}</main>
      <PublicFooter />
    </div>
  );
}
