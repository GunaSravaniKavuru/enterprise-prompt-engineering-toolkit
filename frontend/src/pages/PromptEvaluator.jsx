import Card from "../components/common/Card";
import QualityRing from "../components/common/QualityRing";
import Icon from "../components/common/Icon";
import { evaluatorScores } from "../data/dummyData";

export default function PromptEvaluator() {
  const { overall, metrics, suggestions } = evaluatorScores;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Prompt Evaluator</h1>
        <p className="mt-1 text-sm text-ink-dim">A structural quality breakdown of your current prompt.</p>
      </div>

      <Card className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-faint">Overall Compliance Score</p>
          <p className="mt-2 font-display text-4xl font-semibold text-ink">
  {overall}
  <span className="text-lg text-ink-faint">/100</span>
</p>

<div className="mt-3">
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      overall >= 90
        ? "bg-green-500/20 text-green-400"
        : overall >= 80
        ? "bg-cyan-500/20 text-cyan-400"
        : "bg-yellow-500/20 text-yellow-400"
    }`}
  >
    {overall >= 90
      ? "Excellent"
      : overall >= 80
      ? "Strong"
      : "Needs Improvement"}
  </span>
</div>

<p className="mt-3 max-w-sm text-sm text-ink-dim">
  Your prompt shows strong compliance with the 5-axis framework. Refining format clarity and task instructions can further improve performance.
</p>
<div className="mt-5">
  <div className="h-2 w-full rounded-full bg-slate-700">
    <div
      className="h-2 rounded-full bg-cyan-400"
      style={{ width: `${overall}%` }}
    />
  </div>
</div>
        </div>
        <QualityRing score={overall} size={140} stroke={11} label="Overall" />
      </Card>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        {metrics.map((m) => (
          <Card
  key={m.label}
  className="flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
>
            <QualityRing score={m.value} size={64} stroke={6} />
            <div className="space-y-1">
  <p className="text-sm font-semibold text-ink">
    {m.label}
  </p>

  <p className="text-xs text-ink-dim">
    {m.description}
  </p>

  <p className="text-xs text-ink-dim">
    Score: {m.value}/100
  </p>

  <span
    className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
      m.value >= 90
        ? "bg-green-500/20 text-green-400"
        : m.value >= 80
        ? "bg-cyan-500/20 text-cyan-400"
        : "bg-yellow-500/20 text-yellow-400"
    }`}
  >
    {m.value >= 90
      ? "Excellent"
      : m.value >= 80
      ? "Strong"
      : "Needs Improvement"}
  </span>
</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="font-display text-sm font-semibold text-ink">Compliance Improvement Suggestions</h2>
        <ul className="mt-3 space-y-3">
          {suggestions.map((s, i) => (
            <li
  key={i}
  className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/40 p-3 text-sm text-ink-dim"
>
              <Icon name="sparkle" size={15} className="mt-0.5 shrink-0 text-amber-300" />
              {s}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
