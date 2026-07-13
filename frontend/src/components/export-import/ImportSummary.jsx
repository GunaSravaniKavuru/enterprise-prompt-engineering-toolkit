import Card from "../common/Card";

export default function ImportSummary({ imported, skipped, failed, duration, summary }) {
  const stats = [
    { label: "Imported", value: imported },
    { label: "Skipped", value: skipped },
    { label: "Failed", value: failed },
    { label: "Duration", value: duration },
  ];

  return (
    <Card className="border border-white/10 bg-[rgba(10,12,20,0.7)] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Import complete</p>
          <p className="mt-1 text-sm text-ink-dim">{summary}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-faint">{stat.label}</p>
            <p className="mt-1 text-lg font-semibold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
