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
          <p className="text-xs uppercase tracking-wide text-ink-faint">Overall Score</p>
          <p className="mt-2 font-display text-4xl font-semibold text-ink">
            {overall}<span className="text-lg text-ink-faint">/100</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-ink-dim">
            This prompt is well structured. Tightening context and adding an example would push it above 90.
          </p>
        </div>
        <QualityRing score={overall} size={140} stroke={11} label="Overall" />
      </Card>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        {metrics.map((m) => (
          <Card key={m.label} className="flex items-center gap-4 p-5">
            <QualityRing score={m.value} size={64} stroke={6} />
            <div>
              <p className="text-sm font-medium text-ink">{m.label}</p>
              <p className="text-xs text-ink-faint">{m.value >= 85 ? "Strong" : m.value >= 70 ? "Solid" : "Needs work"}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="font-display text-sm font-semibold text-ink">Suggestions</h2>
        <ul className="mt-3 space-y-3">
          {suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink-dim">
              <Icon name="sparkle" size={15} className="mt-0.5 shrink-0 text-amber-300" />
              {s}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
