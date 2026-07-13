import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import QualityRing from "../components/common/QualityRing";
import { optimizerExample } from "../data/dummyData";

export default function PromptOptimizer() {
  const { original, optimized, summary, scoreBefore, scoreAfter } = optimizerExample;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Prompt Optimizer</h1>
          <p className="mt-1 text-sm text-ink-dim">See how a vague prompt is rewritten into a precise, constrained instruction.</p>
        </div>
        <Button icon="sparkle">Optimize Another Prompt</Button>
      </div>

      <Card className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-around">
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-faint">Before</p>
          <QualityRing score={scoreBefore} size={92} stroke={8} />
        </div>
        <Icon name="chevronRight" size={22} className="text-ink-faint rotate-90 sm:rotate-0" />
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-faint">After</p>
          <QualityRing score={scoreAfter} size={92} stroke={8} />
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-ink-faint">Improvement</p>
          <p className="mt-2 font-display text-3xl font-semibold text-emerald-400">
            +{scoreAfter - scoreBefore}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-ink">Original Prompt</h2>
          <p className="mt-3 rounded-xl bg-black/30 p-4 text-sm leading-relaxed text-ink-dim">{original}</p>
        </Card>
        <Card className="p-5 border-violet-500/20">
          <h2 className="font-display text-sm font-semibold text-ink">Optimized Prompt</h2>
          <p className="mt-3 rounded-xl bg-black/30 p-4 text-sm leading-relaxed text-ink">{optimized}</p>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-display text-sm font-semibold text-ink">Improvement Summary</h2>
        <ul className="mt-3 space-y-2.5">
          {summary.map((s, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink-dim">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-400">
                <Icon name="check" size={12} className="text-black" />
              </span>
              {s}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
