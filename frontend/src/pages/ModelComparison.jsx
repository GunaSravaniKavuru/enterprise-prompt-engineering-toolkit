import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Icon from "../components/common/Icon";
import Button from "../components/common/Button";
import { comparisonRows } from "../data/dummyData";

export default function ModelComparison() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Multi-model Comparison</h1>
          <p className="mt-1 text-sm text-ink-dim">Comparing "Customer Churn Diagnosis Agent" across 3 models.</p>
        </div>
        <Button icon="columns" size="sm">Add Model</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border-soft)] text-xs uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3.5 font-medium">Model</th>
                <th className="px-5 py-3.5 font-medium">Response</th>
                <th className="px-5 py-3.5 font-medium">Latency</th>
                <th className="px-5 py-3.5 font-medium">Score</th>
                <th className="px-5 py-3.5 font-medium">Winner</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-[var(--color-border-soft)] last:border-0 ${
                    row.winner ? "bg-violet-500/[0.04]" : ""
                  }`}
                >
                  <td className="px-5 py-4 font-medium text-ink">{row.model}</td>
                  <td className="max-w-xs px-5 py-4 text-ink-dim">{row.response}</td>
                  <td className="px-5 py-4 font-mono text-ink-dim">{row.latency}</td>
                  <td className="px-5 py-4">
                    <Badge tone={row.score >= 90 ? "emerald" : row.score >= 75 ? "cyan" : "amber"}>
                      {row.score}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    {row.winner ? (
                      <span className="flex items-center gap-1.5 text-emerald-300">
                        <Icon name="check" size={15} /> Winner
                      </span>
                    ) : (
                      <span className="text-ink-faint">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
