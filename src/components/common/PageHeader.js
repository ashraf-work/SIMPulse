export function PageHeader({ icon: Icon, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-neutral-900">
          {Icon ? <Icon className="h-8 w-8 text-red-500" /> : null}
          {title}
        </h1>
        <p className="mt-1 text-sm font-medium text-neutral-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
