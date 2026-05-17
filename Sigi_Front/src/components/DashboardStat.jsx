export default function DashboardStat({ label, value, hint, accent = 'orange' }) {
  const accents = {
    orange: 'from-orange-500 to-amber-600',
    red: 'from-red-500 to-rose-600',
    emerald: 'from-emerald-500 to-teal-600',
    sky: 'from-sky-500 to-blue-600',
    indigo: 'from-indigo-500 to-violet-600',
    slate: 'from-slate-600 to-slate-800',
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white p-5 shadow-lg shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-xl">
      <div
        className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${accents[accent] ?? accents.orange} opacity-10 transition group-hover:opacity-20`}
      />
      <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
