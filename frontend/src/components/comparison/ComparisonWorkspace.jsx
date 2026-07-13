import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Card from "../common/Card";
import Button from "../common/Button";
import Icon from "../common/Icon";
import Badge from "../common/Badge";

const promptCatalog = [
  {
    id: "churn",
    title: "Customer Churn Diagnosis",
    description: "Assess churn-risk signals and propose a concise action plan.",
    variables: ["accountId", "segment", "lastInteractionDate", "productUsageTrend"],
  },
  {
    id: "support",
    title: "Support Triage Assistant",
    description: "Prioritize urgent issues and draft a customer-ready response.",
    variables: ["ticketId", "priority", "customerTone", "timeline"],
  },
  {
    id: "launch",
    title: "Product Launch Brief",
    description: "Summarize the launch narrative and define the key messaging.",
    variables: ["launchDate", "audience", "valueProp", "riskFlags"],
  },
];

const modelCatalog = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    quality: 92,
    latency: 1.3,
    tokens: 1800,
    cost: 0.021,
    response: "GPT-4o produced a crisp, structured response with very strong technical depth and fast turnaround.",
    output: "## Recommendation\n- Prioritize the highest-risk segment first.\n- Keep the tone calm and action-oriented.\n\n```ts\nconst nextAction = 'Escalate to the retention pod';\n```",
  },
  {
    id: "claude-3.7",
    name: "Claude 3.7",
    provider: "Anthropic",
    quality: 95,
    latency: 1.8,
    tokens: 2100,
    cost: 0.018,
    response: "Claude 3.7 was the most balanced option, combining careful reasoning with a polished executive-ready tone.",
    output: "## Summary\n- The evidence strongly supports proactive outreach.\n- The recommended messaging should be concise and confident.\n\n```md\n**Key move:** sync customer success and product for a joint follow-up.\n```",
  },
  {
    id: "gemini-2.0",
    name: "Gemini 2.0",
    provider: "Google",
    quality: 88,
    latency: 1.1,
    tokens: 2600,
    cost: 0.016,
    response: "Gemini 2.0 delivered a fast, creative response with strong contextual synthesis but slightly looser structure.",
    output: "## Snapshot\n- Excellent for broad ideation and brainstorming.\n- Less precise when strict formatting matters.\n\n```json\n{\n  \"focus\": \"clarity\"\n}\n```",
  },
];

const toneMap = {
  violet: "border-violet-400/25 bg-violet-500/10 text-violet-200",
  cyan: "border-cyan-400/25 bg-cyan-500/15 text-cyan-200",
  emerald: "border-emerald-400/25 bg-emerald-500/10 text-emerald-200",
  amber: "border-amber-400/25 bg-amber-500/10 text-amber-200",
};

function ToneBadge({ tone = "violet", children }) {
  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneMap[tone] || toneMap.violet}`}>{children}</span>;
}

function renderMarkdown(markdown) {
  const escaped = markdown.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = escaped
    .replace(/```([\w-]*)\n([\s\S]*?)```/g, (_, lang, code) => `<pre class="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-slate-950/90 p-3 text-sm text-slate-100"><code class="language-${lang || "text"}">${code.trim()}</code></pre>`)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/^(#{1,3})\s+(.*)$/gm, "<h$1 class=\"mt-3 text-sm font-semibold text-ink\">$2</h$1>")
    .replace(/\n{2,}/g, "</p><p class=\"mt-2 text-sm leading-7 text-ink-dim\">")
    .replace(/\n/g, "<br />");

  return { __html: `<p class="text-sm leading-7 text-ink-dim">${html.replace(/<p>|<\/p>/g, "")}</p>` };
}

function StickyHeader({ title, description, onCompare, onClear, hasResults }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-20 rounded-[28px] border border-[var(--color-border-hi)] bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.16),_transparent_30%),rgba(10,12,20,0.92)] px-4 py-4 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.85)] backdrop-blur xl:px-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-violet-200">
            <Icon name="gauge" size={13} /> Multi model comparison
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{title}</h1>
          <p className="mt-2 text-sm leading-7 text-ink-dim">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" icon="play" onClick={onCompare}>Compare</Button>
          <Button variant="secondary" size="sm" icon="x" onClick={onClear} disabled={!hasResults}>Clear Results</Button>
        </div>
      </div>
    </motion.header>
  );
}

function ComparisonConfigCard({ prompt, setPrompt, selectedModels, toggleModel, variables, setVariable, onRun, promptOptions }) {
  const selectedPrompt = promptCatalog.find((item) => item.id === prompt) || promptCatalog[0];

  return (
    <Card className="p-4 lg:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Configuration</p>
          <h2 className="mt-2 font-display text-lg font-semibold text-ink">Run a focused evaluation</h2>
        </div>
        <Badge tone="cyan">Live</Badge>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block text-sm text-ink-dim">
          <span className="mb-2 block font-medium text-ink">Prompt selector</span>
          <select value={prompt} onChange={(event) => setPrompt(event.target.value)} className="w-full rounded-2xl border border-[var(--color-border-soft)] bg-[#11141c] px-3 py-2.5 text-sm text-ink outline-none focus-ring">
            {promptOptions.map((item) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
        </label>

        <div>
          <p className="mb-2 font-medium text-ink">Model selection</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {modelCatalog.map((model) => {
              const checked = selectedModels.includes(model.id);
              return (
                <label key={model.id} className={`flex cursor-pointer items-center justify-between rounded-2xl border px-3 py-3 text-sm transition ${checked ? "border-violet-400/25 bg-violet-500/10 text-ink" : "border-[var(--color-border-soft)] bg-white/[0.03] text-ink-dim"}`}>
                  <span>{model.name}</span>
                  <input type="checkbox" checked={checked} onChange={() => toggleModel(model.id)} className="h-4 w-4 rounded border-white/15 bg-transparent accent-violet-400" />
                </label>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-ink">Prompt variables</p>
            <Badge tone="emerald">Dynamic</Badge>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {selectedPrompt.variables.map((variable) => (
              <label key={variable} className="text-sm text-ink-dim">
                <span className="mb-1.5 block text-xs uppercase tracking-[0.24em] text-ink-faint">{variable}</span>
                <input value={variables[variable] || ""} onChange={(event) => setVariable(variable, event.target.value)} className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[#12141f] px-3 py-2 text-sm text-ink outline-none focus-ring" placeholder={`Enter ${variable}`} />
              </label>
            ))}
          </div>
        </div>

        <Button className="w-full" icon="play" onClick={onRun}>Run comparison</Button>
      </div>
    </Card>
  );
}

function LoadingState() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
        <div className="h-2 w-28 rounded-full bg-white/10" />
        <div className="mt-4 h-3 w-full rounded-full bg-white/10" />
        <div className="mt-2 h-3 w-3/4 rounded-full bg-white/10" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-[24px] border border-[var(--color-border-soft)] bg-white/[0.03] p-4">
            <div className="h-3 w-20 rounded-full bg-white/10" />
            <div className="mt-4 h-20 rounded-2xl bg-white/10" />
            <div className="mt-3 h-3 w-full rounded-full bg-white/10" />
            <div className="mt-2 h-3 w-3/4 rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function EmptyState({ onRun }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-dashed border-[var(--color-border-soft)] bg-white/[0.025] p-8 text-center shadow-[0_18px_60px_-24px_rgba(0,0,0,0.65)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200">
        <Icon name="sparkle" size={24} />
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold text-ink">No comparison has been run yet</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-ink-dim">Select your prompt, choose the models you want to compare, and generate a focused side-by-side evaluation in seconds.</p>
      <Button className="mt-5" icon="play" onClick={onRun}>Compare models</Button>
    </motion.div>
  );
}

function ComparisonSummary({ results }) {
  if (!results.length) return null;

  const fastest = [...results].sort((a, b) => a.latency - b.latency)[0];
  const cheapest = [...results].sort((a, b) => a.cost - b.cost)[0];
  const highestQuality = [...results].sort((a, b) => b.quality - a.quality)[0];
  const longest = [...results].sort((a, b) => b.outputLength - a.outputLength)[0];
  const shortest = [...results].sort((a, b) => a.outputLength - b.outputLength)[0];
  const bestOverall = [...results].sort((a, b) => b.weightedScore - a.weightedScore)[0];

  const items = [
    { title: "Fastest", value: fastest.name, detail: `${fastest.latency.toFixed(1)}s`, tone: "cyan" },
    { title: "Lowest cost", value: cheapest.name, detail: `$${cheapest.cost.toFixed(3)}`, tone: "emerald" },
    { title: "Highest quality", value: highestQuality.name, detail: `${highestQuality.quality}/100`, tone: "violet" },
    { title: "Longest response", value: longest.name, detail: `${longest.outputLength} chars`, tone: "amber" },
    { title: "Shortest response", value: shortest.name, detail: `${shortest.outputLength} chars`, tone: "amber" },
    { title: "Best overall", value: bestOverall.name, detail: `${bestOverall.weightedScore}/100`, tone: "violet" },
  ];

  return (
    <Card className="p-4 lg:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Summary</p>
          <h2 className="mt-2 font-display text-lg font-semibold text-ink">At-a-glance comparison</h2>
        </div>
        <Badge tone="emerald">Premium readout</Badge>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-ink">{item.title}</p>
              <ToneBadge tone={item.tone}>{item.detail}</ToneBadge>
            </div>
            <p className="mt-2 text-sm text-ink-dim">{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ComparisonResults({ results, onCopy, onDownload }) {
  const gridClass = results.length <= 1 ? "grid-cols-1" : results.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {results.map((result, index) => (
        <motion.article key={result.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="flex h-full flex-col rounded-[24px] border border-[var(--color-border-soft)] bg-white/[0.03] p-4 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.65)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg font-semibold text-ink">{result.name}</h3>
                <Badge tone={result.quality >= 93 ? "violet" : result.quality >= 90 ? "cyan" : "emerald"}>{result.provider}</Badge>
              </div>
              <p className="mt-2 text-sm leading-7 text-ink-dim">{result.response}</p>
            </div>
            <Badge tone={result.quality >= 93 ? "violet" : result.quality >= 90 ? "cyan" : "emerald"}>Score {result.quality}</Badge>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3 text-sm text-ink-dim">
              <div className="flex items-center justify-between">
                <span>Response time</span>
                <span className="font-semibold text-ink">{result.latency.toFixed(1)}s</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Tokens</span>
                <span className="font-semibold text-ink">{result.tokens.toLocaleString()}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3 text-sm text-ink-dim">
              <div className="flex items-center justify-between">
                <span>Estimated cost</span>
                <span className="font-semibold text-ink">${result.cost.toFixed(3)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Length</span>
                <span className="font-semibold text-ink">{result.outputLength} chars</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-[var(--color-border-soft)] bg-slate-950/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-ink">Generated output</p>
              <Badge tone="neutral">Markdown</Badge>
            </div>
            <div className="max-h-60 overflow-auto rounded-2xl border border-white/10 bg-slate-950/80 p-3" dangerouslySetInnerHTML={renderMarkdown(result.output)} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" icon="copy" onClick={() => onCopy(result)}>Copy response</Button>
            <Button variant="secondary" size="sm" icon="download" onClick={() => onDownload(result)}>Download response</Button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function ComparisonInsights({ results }) {
  if (!results.length) return null;

  const insights = [
    `✓ ${results[0].name} produced the fastest response for this prompt.`,
    `✓ ${results.find((item) => item.quality >= 93)?.name || results[0].name} delivered the highest quality score.`,
    `✓ ${results.reduce((best, item) => (item.cost < best.cost ? item : best), results[0]).name} had the lowest estimated cost.`,
    `✓ ${results.reduce((best, item) => (item.outputLength > best.outputLength ? item : best), results[0]).name} generated the longest explanation.`,
  ];

  return (
    <Card className="p-4 lg:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Insights</p>
          <h2 className="mt-2 font-display text-lg font-semibold text-ink">Concise comparison notes</h2>
        </div>
        <Badge tone="cyan">Readable</Badge>
      </div>
      <div className="mt-4 space-y-2">
        {insights.map((item) => (
          <div key={item} className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 px-3 py-3 text-sm text-ink-dim">{item}</div>
        ))}
      </div>
    </Card>
  );
}

export default function ComparisonWorkspace() {
  const [prompt, setPrompt] = useState(promptCatalog[0].id);
  const [selectedModels, setSelectedModels] = useState(["gpt-4o", "claude-3.7", "gemini-2.0"]);
  const [variables, setVariables] = useState({
    accountId: "AC-2048",
    segment: "Enterprise",
    lastInteractionDate: "2026-06-19",
    productUsageTrend: "Steady decline",
  });
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    const timer = window.setTimeout(() => {
      if (!active) return;
      const nextResults = buildResults(selectedModels, prompt, variables);
      setResults(nextResults);
      setIsLoading(false);
    }, 900);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [prompt, selectedModels, variables]);

  const currentPrompt = useMemo(() => promptCatalog.find((item) => item.id === prompt) || promptCatalog[0], [prompt]);

  const toggleModel = (modelId) => {
    setSelectedModels((current) => (current.includes(modelId) ? current.filter((item) => item !== modelId) : [...current, modelId]));
  };

  const handleVariableChange = (key, value) => {
    setVariables((current) => ({ ...current, [key]: value }));
  };

  const handleRunComparison = () => {
    setIsLoading(true);
    window.setTimeout(() => {
      setResults(buildResults(selectedModels, prompt, variables));
      setIsLoading(false);
    }, 700);
  };

  const handleClearResults = () => {
    setSelectedModels([]);
    setResults([]);
  };

  const handleCopy = async (result) => {
    try {
      await navigator.clipboard.writeText(result.output);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = (result) => {
    const blob = new Blob([result.output], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.name.toLowerCase().replace(/\s+/g, "-")}-response.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-2 sm:px-6 lg:px-8">
      <StickyHeader title="Multi model comparison" description={`${currentPrompt.description} Choose the models that matter most for your task and review the outcomes side by side.`} onCompare={handleRunComparison} onClear={handleClearResults} hasResults={results.length > 0} />
      <div className="flex flex-col gap-4">
        <ComparisonConfigCard prompt={prompt} setPrompt={setPrompt} selectedModels={selectedModels} toggleModel={toggleModel} variables={variables} setVariable={handleVariableChange} onRun={handleRunComparison} promptOptions={promptCatalog} />
        <ComparisonSummary results={results} />
        {isLoading ? <LoadingState /> : results.length ? <ComparisonResults results={results} onCopy={handleCopy} onDownload={handleDownload} /> : <EmptyState onRun={handleRunComparison} />}
      </div>
      {results.length > 0 && <ComparisonInsights results={results} />}
    </div>
  );
}

function buildResults(selectedModels, prompt, variables) {
  const promptDescription = promptCatalog.find((item) => item.id === prompt)?.title || "Prompt";

  return selectedModels
    .map((modelId) => {
      const model = modelCatalog.find((item) => item.id === modelId);
      if (!model) return null;

      const outputLength = model.output.length;
      const weightedScore = Math.round(model.quality * 0.7 + (100 - model.latency * 20) * 0.15 + (100 - model.cost * 900) * 0.15);

      return {
        ...model,
        id: model.id,
        name: model.name,
        provider: model.provider,
        quality: model.quality,
        latency: model.latency,
        tokens: model.tokens,
        cost: model.cost,
        output: `${model.output}\n\nPrompt: ${promptDescription}\nVariables: ${Object.entries(variables).map(([key, value]) => `${key}=${value}`).join(", ")}`,
        outputLength,
        weightedScore,
      };
    })
    .filter(Boolean);
}
