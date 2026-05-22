export function PageHeader({ icon: Icon, title, description, action }) {
  return (
    <div className="mb-6 flex animate-in fade-in slide-in-from-bottom-2 duration-300 flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-slate-950">
          {Icon ? <Icon className="h-6 w-6 text-red-500" /> : null}
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
