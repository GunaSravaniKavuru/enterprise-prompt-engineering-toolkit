import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import QualityRing from "../components/common/QualityRing";
import { optimizerExample } from "../data/dummyData";

export default function PromptOptimizer() {
  const { original, optimized, summary, scoreBefore, scoreAfter } = optimizerExample;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white">
  Prompt Optimizer
</h1>

<p className="mt-3 max-w-3xl text-base leading-7 text-gray-400">
  Compare the original and optimized prompts to understand how better prompt engineering improves clarity, precision, and AI response quality.
</p>
        </div>
        <Button icon="sparkle" className="px-6 py-3 rounded-xl shadow-lg">Optimize Another Prompt</Button>
      </div>
<Card className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-faint">Before</p>
          <QualityRing score={scoreBefore} size={72} stroke={7} />
        </div>
        <div className="hidden md:block border-l border-slate-700 h-20 mx-auto"></div>
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-faint">After</p>
          <QualityRing score={scoreAfter} size={72} stroke={7} />
        </div>
        <div className="text-center md:col-span-3 mt-4 border-t border-slate-700 pt-4">
  <p className="text-xs uppercase tracking-wide text-ink-faint">
    Overall Improvement
  </p>

  <p className="mt-2 font-display text-4xl font-bold text-emerald-400">
    +{scoreAfter - scoreBefore}
  </p>
</div>
        </div> 
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <Card className="p-8 rounded-2xl border border-slate-700 bg-slate-900/60 shadow-lg hover:border-cyan-500/40 transition-all duration-300">
    <h2 className="font-display text-xl font-semibold text-white">
      Original Prompt
    </h2>

    <p className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-6 text-sm leading-8 text-gray-300">
      {original}
    </p>
  </Card>

  <Card className="p-8 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/20 to-slate-900 shadow-lg">
    <h2 className="font-display text-xl font-semibold text-violet-300">
      Optimized Prompt
    </h2>

    <p className="mt-4 rounded-xl border border-violet-500/20 bg-black/40 p-6 text-sm leading-8 text-white">
      {optimized}
    </p>
  </Card>
</div>

      <Card className="rounded-3xl border border-slate-700 bg-slate-900/70 p-8 shadow-xl">
        <h2 className="font-display text-xl font-semibold text-white">Improvement Summary</h2>
       <ul className="mt-6 space-y-4">
          {summary.map((s, i) => (
           <li
  key={i}
  className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-base text-gray-200 transition-all hover:border-violet-500/40"
>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                <Icon name="check" size={16} className="text-emerald-400" />
              </span>
              {s}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
