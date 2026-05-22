export function SectionHeader({ eyebrow, title, description, align = "center" }) {
  return (
    <div className={`mx-auto mb-10 max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300 ${align === "center" ? "text-center" : ""}`}>
      {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-red-500">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}
