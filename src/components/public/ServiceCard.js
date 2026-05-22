export function ServiceCard({ icon: Icon, title, description }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/70">
      <div className="mb-4 inline-flex rounded-lg bg-red-50 p-3 text-red-500 transition duration-200 group-hover:bg-red-500 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
