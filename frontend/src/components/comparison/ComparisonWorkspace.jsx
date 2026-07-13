import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Card from "../common/Card";
import Button from "../common/Button";
import Icon from "../common/Icon";
import { QualityRadarChart } from "../charts/Charts";

const comparisonData = [
  {
    id: 1,
    model: "Claude Sonnet 5",
    provider: "Anthropic",
    quality: 95,
    reasoning: 94,
    accuracy: 92,
    creativity: 88,
    safety: 96,
    completeness: 91,
    latencyMs: 1800,
    latencyLabel: "1.8s",
    tokens: 2100,
    cost: 0.018,
    costLabel: "$0.018",
    rank: 1,
    winner: true,
    strengths: ["Strong instruction following", "Low hallucination risk", "Excellent structure"],
    weaknesses: ["Slightly slower", "Higher cost than the fastest option"],
    fullResponse:
      "Claude delivered a structured answer with clear reasoning, relevant caveats, and a concise recommendation. It is especially strong when the task requires nuance and high confidence.",
    reasoningSummary:
      "Best fit for complex enterprise prompts where clarity, caution, and professional tone matter most.",
  },
  {
    id: 2,
    model: "GPT-5",
    provider: "OpenAI",
    quality: 91,
    reasoning: 91,
    accuracy: 90,
    creativity: 84,
    safety: 92,
    completeness: 90,
    latencyMs: 1300,
    latencyLabel: "1.3s",
    tokens: 1800,
    cost: 0.021,
    costLabel: "$0.021",
    rank: 2,
    winner: false,
    strengths: ["Fast execution", "Strong technical depth", "Reliable coding output"],
    weaknesses: ["Less nuanced for policy-heavy prompts"],
    fullResponse:
      "GPT-5 returned a concise and technically strong answer with quick turnaround. It is highly effective for coding, technical analysis, and rapid iteration.",
    reasoningSummary:
      "A strong all-rounder when speed and technical precision are more important than softer reasoning.",
  },
  {
    id: 3,
    model: "Gemini 2.5 Pro",
    provider: "Google",
    quality: 87,
    reasoning: 86,
    accuracy: 88,
    creativity: 93,
    safety: 89,
    completeness: 85,
    latencyMs: 1100,
    latencyLabel: "1.1s",
    tokens: 2600,
    cost: 0.016,
    costLabel: "$0.016",
    rank: 3,
    winner: false,
    strengths: ["Creative voice", "Fastest latency", "Good contextual synthesis"],
    weaknesses: ["Less strict structure", "Slightly higher risk on precision tasks"],
    fullResponse:
      "Gemini produced a vivid and conversational answer with good context synthesis. It shines in creative or broad brainstorming scenarios, though it is less consistent for strict enterprise tasks.",
    reasoningSummary:
      "Best for rapid, imaginative workflows where the main goal is breadth and style rather than strict rigor.",
  },
];

const promptData = {
  title: "Customer Churn Diagnosis Agent",
  content:
    "Analyze a churn-risk signal, identify likely causes, provide a short action plan, and explain the confidence level in a concise business-friendly format.",
  models: ["Claude Sonnet 5", "GPT-5", "Gemini 2.5 Pro"],
};

const summaryCards = [
  { label: "Recommended Model", model: "Claude Sonnet 5", score: "95/100", explanation: "Best overall balance of quality, safety, and clarity.", badge: "Recommended", tone: "violet", icon: "sparkle" },
  { label: "Fastest Model", model: "Gemini 2.5 Pro", score: "1.1s", explanation: "Lowest latency for quick-turn workflows.", badge: "Fast", tone: "cyan", icon: "play" },
  { label: "Cheapest Model", model: "Gemini 2.5 Pro", score: "$0.016", explanation: "Most cost-efficient option for high-volume runs.", badge: "Cost-effective", tone: "emerald", icon: "chart" },
  { label: "Highest Quality", model: "Claude Sonnet 5", score: "95/100", explanation: "Best reasoning and policy-aware answer quality.", badge: "Top-tier", tone: "amber", icon: "gauge" },
];

const recommendation = {
  model: "Claude Sonnet 5",
  confidence: 92,
  why: "It offers the best balance of reasoning depth, safety, and business-ready clarity for a demanding prompt.",
  bestUseCases: ["Enterprise analysis", "Prompt engineering", "Document review"],
  tradeoffs: ["Slightly slower than Gemini", "Higher cost than the cheapest option"],
};

const taskRecommendations = [
  { task: "Coding", model: "GPT-5", reason: "Fastest and strongest technical execution." },
  { task: "Creative Writing", model: "Gemini 2.5 Pro", reason: "Most expressive and stylistically rich output." },
  { task: "Summarization", model: "Claude Sonnet 5", reason: "Excellent clarity and polished compression." },
  { task: "Reasoning", model: "Claude Sonnet 5", reason: "Best depth and consistency for multi-step logic." },
  { task: "Translation", model: "GPT-5", reason: "Reliable structure for multilingual work." },
  { task: "Research", model: "GPT-5", reason: "Quick synthesis with strong analytical flow." },
  { task: "Customer Support", model: "Claude Sonnet 5", reason: "Balanced empathy and policy-aware response quality." },
  { task: "RAG", model: "Claude Sonnet 5", reason: "Strong grounding and evidence-aware summarization." },
];

const exportOptions = ["PDF", "Markdown", "JSON", "CSV"];

function ToneBadge({ tone = "violet", children }) {
  const tones = {
    violet: "border-violet-400/25 bg-violet-500/15 text-violet-200",
    cyan: "border-cyan-400/25 bg-cyan-500/15 text-cyan-200",
    emerald: "border-emerald-400/25 bg-emerald-500/15 text-emerald-200",
    amber: "border-amber-400/25 bg-amber-500/15 text-amber-200",
  };
  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${tones[tone] || tones.violet}`}>{children}</span>;
}

function ScoreBar({ value, color }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function PromptHeader() {
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-[28px] border border-[var(--color-border-hi)] bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.16),_transparent_30%),rgba(16,18,28,0.95)] p-6 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.85)] lg:p-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-violet-200">
            <Icon name="gauge" size={13} /> Model selection workspace
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">Multi-model comparison</h1>
          <p className="mt-3 text-sm leading-7 text-ink-dim sm:text-[15px]">
            Choose the right model for a prompt with confidence, using a focused view of quality, latency, price, and reasoning.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" icon="play">Compare</Button>
          <Button variant="secondary" size="sm" icon="check">Edit Prompt</Button>
          <Button variant="secondary" size="sm" icon="download">Export</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Prompt under evaluation</p>
          <h2 className="mt-2 font-display text-lg font-semibold text-ink">{promptData.title}</h2>
          <p className="mt-2 text-sm leading-7 text-ink-dim">{promptData.content}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Selected models</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {promptData.models.map((model) => (
              <span key={model} className="rounded-full border border-[var(--color-border-soft)] bg-white/[0.03] px-3 py-1.5 text-sm text-ink-dim">{model}</span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-ink-dim">
            <Icon name="check" size={15} className="text-emerald-300" />
            All models are ready for side-by-side evaluation.
          </div>
        </Card>
      </div>
    </motion.section>
  );
}

function ExecutiveSummary() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summaryCards.map((item, index) => (
        <motion.div key={item.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
          <Card className="h-full p-4 transition-all duration-200 hover:-translate-y-1 hover:border-violet-400/25">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04] text-violet-200">
                <Icon name={item.icon} size={18} />
              </div>
              <ToneBadge tone={item.tone}>{item.badge}</ToneBadge>
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-ink-faint">{item.label}</p>
            <p className="mt-2 text-sm font-semibold text-ink">{item.model}</p>
            <p className="mt-3 text-sm leading-6 text-ink-dim">{item.explanation}</p>
            <p className="mt-3 font-display text-lg font-semibold text-ink">{item.score}</p>
          </Card>
        </motion.div>
      ))}
    </section>
  );
}

function RecommendationCard() {
  return (
    <Card hi className="p-5 lg:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-violet-200">
            <Icon name="sparkle" size={13} /> AI recommendation
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-ink">{recommendation.model} is the best fit</h2>
          <p className="mt-3 text-sm leading-7 text-ink-dim">{recommendation.why}</p>
        </div>
        <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-center">
          <p className="text-[11px] uppercase tracking-[0.24em] text-violet-200">Confidence</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">{recommendation.confidence}%</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <p className="text-sm font-semibold text-ink">Best use cases</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recommendation.bestUseCases.map((item) => (
              <span key={item} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-200">{item}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <p className="text-sm font-semibold text-ink">Trade-offs</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-dim">
            {recommendation.tradeoffs.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

function ComparisonTable() {
  const [providerFilter, setProviderFilter] = useState("All");
  const [sortBy, setSortBy] = useState("quality");
  const [expandedId, setExpandedId] = useState(1);

  const visibleRows = useMemo(() => {
    let rows = providerFilter === "All" ? comparisonData : comparisonData.filter((item) => item.provider === providerFilter);
    rows = [...rows].sort((a, b) => {
      if (sortBy === "latency") return a.latencyMs - b.latencyMs;
      if (sortBy === "cost") return a.cost - b.cost;
      if (sortBy === "tokens") return b.tokens - a.tokens;
      return b.quality - a.quality;
    });
    return rows;
  }, [providerFilter, sortBy]);

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-4 border-b border-[var(--color-border-soft)] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Compare models</h2>
          <p className="mt-1 text-sm text-ink-dim">Filter by provider and sort by the signal that matters most.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="text-sm text-ink-dim">
            <span className="sr-only">Filter by provider</span>
            <select value={providerFilter} onChange={(event) => setProviderFilter(event.target.value)} className="rounded-xl border border-[var(--color-border-soft)] bg-[#12141f] px-3 py-2 text-sm text-ink focus-ring">
              <option value="All">All providers</option>
              <option value="Anthropic">Anthropic</option>
              <option value="OpenAI">OpenAI</option>
              <option value="Google">Google</option>
            </select>
          </label>
          <label className="text-sm text-ink-dim">
            <span className="sr-only">Sort models</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-xl border border-[var(--color-border-soft)] bg-[#12141f] px-3 py-2 text-sm text-ink focus-ring">
              <option value="quality">Sort by quality</option>
              <option value="latency">Sort by latency</option>
              <option value="cost">Sort by cost</option>
              <option value="tokens">Sort by tokens</option>
            </select>
          </label>
        </div>
      </div>

      {visibleRows.length === 0 ? (
        <div className="p-8 text-center text-sm text-ink-dim">No models match the current filter.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-left text-sm">
            <thead className="bg-white/[0.02] text-xs uppercase tracking-[0.24em] text-ink-faint">
              <tr>
                <th className="px-5 py-3.5 font-medium">Model</th>
                <th className="px-5 py-3.5 font-medium">Quality</th>
                <th className="px-5 py-3.5 font-medium">Latency</th>
                <th className="px-5 py-3.5 font-medium">Cost</th>
                <th className="px-5 py-3.5 font-medium">Tokens</th>
                <th className="px-5 py-3.5 font-medium">Rank</th>
                <th className="px-5 py-3.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <>
                  <tr key={row.id} className="border-t border-[var(--color-border-soft)] text-ink-dim hover:bg-white/[0.025]">
                    <td className="px-5 py-4">
                      <div className="font-medium text-ink">{row.model}</div>
                      <div className="mt-1 text-xs text-ink-faint">{row.provider}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-ink-dim">
                          <span>{row.quality}%</span>
                          <ToneBadge tone={row.winner ? "emerald" : "cyan"}>{row.winner ? "Best" : "Strong"}</ToneBadge>
                        </div>
                        <ScoreBar value={row.quality} color={row.winner ? "#8b5cf6" : "#22d3ee"} />
                      </div>
                    </td>
                    <td className="px-5 py-4">{row.latencyLabel}</td>
                    <td className="px-5 py-4">{row.costLabel}</td>
                    <td className="px-5 py-4">{row.tokens.toLocaleString()}</td>
                    <td className="px-5 py-4">#{row.rank}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setExpandedId(row.id)}>View Response</Button>
                        <Button variant="ghost" size="sm" onClick={() => setExpandedId(row.id)}>Expand</Button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === row.id && (
                    <tr key={`${row.id}-detail`}>
                      <td colSpan={7} className="bg-black/15 px-5 py-4">
                        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white/[0.03] p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-ink">{row.model} response</p>
                              <p className="mt-1 text-sm leading-7 text-ink-dim">{row.fullResponse}</p>
                            </div>
                            <ToneBadge tone={row.winner ? "emerald" : "cyan"}>{row.winner ? "Recommended" : "Alternative"}</ToneBadge>
                          </div>
                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3">
                              <p className="text-sm font-semibold text-ink">Strengths</p>
                              <ul className="mt-2 space-y-2 text-sm text-ink-dim">
                                {row.strengths.map((item) => <li key={item} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />{item}</li>)}
                              </ul>
                            </div>
                            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3">
                              <p className="text-sm font-semibold text-ink">Weaknesses</p>
                              <ul className="mt-2 space-y-2 text-sm text-ink-dim">
                                {row.weaknesses.map((item) => <li key={item} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />{item}</li>)}
                              </ul>
                            </div>
                          </div>
                          <div className="mt-4 rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3">
                            <p className="text-sm font-semibold text-ink">Reasoning summary</p>
                            <p className="mt-2 text-sm leading-7 text-ink-dim">{row.reasoningSummary}</p>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant="secondary" size="sm" icon="copy">Copy</Button>
                            <Button variant="secondary" size="sm" icon="download">Download</Button>
                            <Button variant="secondary" size="sm" icon="x">Collapse</Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function AIJudgePanel() {
  return (
    <Card hi className="p-5 lg:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-200">
            <Icon name="gauge" size={13} /> AI judge analysis
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-ink">Why Claude Sonnet 5 wins</h2>
          <p className="mt-3 text-sm leading-7 text-ink-dim">
            The winning model is not just the highest-scoring one. It is the most reliable for this prompt because it combines strong reasoning, explicit caution, and clear business output.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-center">
          <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-200">Confidence</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">92%</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <p className="text-sm font-semibold text-ink">Strengths</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-dim">
            <li>Excellent instruction following</li>
            <li>Low hallucination risk</li>
            <li>High clarity for product and operations teams</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <p className="text-sm font-semibold text-ink">Weaknesses</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-dim">
            <li>Less creative than Gemini</li>
            <li>Lower speed than the fastest option</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <p className="text-sm font-semibold text-ink">Recommended for</p>
          <p className="mt-2 text-sm text-ink-dim">High-stakes business decisions, enterprise policy review, and prompt-quality-sensitive workflows.</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <p className="text-sm font-semibold text-ink">Not recommended for</p>
          <p className="mt-2 text-sm text-ink-dim">Ultra-low-latency content generation where raw speed matters more than rigor.</p>
        </div>
      </div>
    </Card>
  );
}

function AnalyticsSection() {
  const latencyData = [
    { name: "Claude", latency: 1.8 },
    { name: "GPT-5", latency: 1.3 },
    { name: "Gemini", latency: 1.1 },
  ];

  const costData = [
    { name: "Claude", cost: 0.018 },
    { name: "GPT-5", cost: 0.021 },
    { name: "Gemini", cost: 0.016 },
  ];

  const tokenData = [
    { name: "Claude", tokens: 2100 },
    { name: "GPT-5", tokens: 1800 },
    { name: "Gemini", tokens: 2600 },
  ];

  const radarData = [
    { metric: "Reasoning", Claude: 94, GPT: 91, Gemini: 86 },
    { metric: "Accuracy", Claude: 92, GPT: 90, Gemini: 88 },
    { metric: "Creativity", Claude: 88, GPT: 84, Gemini: 93 },
    { metric: "Safety", Claude: 96, GPT: 92, Gemini: 89 },
    { metric: "Completeness", Claude: 91, GPT: 90, Gemini: 85 },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="p-5">
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">Performance analytics</h2>
          <p className="mt-1 text-sm text-ink-dim">The signals that matter most when choosing a model.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
            <p className="text-sm font-semibold text-ink">Latency</p>
            <div className="mt-3 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latencyData}>
                  <CartesianGrid stroke="rgba(148,156,199,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6a6f85" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6a6f85" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="latency" radius={[8, 8, 0, 0]} fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
            <p className="text-sm font-semibold text-ink">Cost</p>
            <div className="mt-3 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData}>
                  <CartesianGrid stroke="rgba(148,156,199,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6a6f85" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6a6f85" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="cost" radius={[8, 8, 0, 0]} fill="#22d3ee" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4 lg:col-span-2">
            <p className="text-sm font-semibold text-ink">Token usage</p>
            <div className="mt-3 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tokenData}>
                  <CartesianGrid stroke="rgba(148,156,199,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6a6f85" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6a6f85" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="tokens" radius={[8, 8, 0, 0]} fill="#f5a623" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">Capability radar</h2>
          <p className="mt-1 text-sm text-ink-dim">Reasoning, accuracy, creativity, safety, and completeness.</p>
        </div>
        <div className="h-[360px]">
          <QualityRadarChart data={radarData} />
        </div>
      </Card>
    </div>
  );
}

function UseCaseRecommendations() {
  return (
    <Card className="p-5 lg:p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-ink">Best model by task</h2>
        <p className="mt-1 text-sm text-ink-dim">Pick the model that matches the job, not just the highest score.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {taskRecommendations.map((item) => (
          <div key={item.task} className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink">{item.task}</p>
              <ToneBadge tone="violet">{item.model}</ToneBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-dim">{item.reason}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ExportPanel() {
  return (
    <Card className="p-5 lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Export comparison</h2>
          <p className="mt-1 text-sm text-ink-dim">Share the recommendation with your team or save it for future review.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {exportOptions.map((option) => (
            <Button key={option} variant="secondary" size="sm" icon="download">Export {option}</Button>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function ComparisonWorkspace() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PromptHeader />
      <ExecutiveSummary />
      <RecommendationCard />
      <ComparisonTable />
      <AIJudgePanel />
      <AnalyticsSection />
      <UseCaseRecommendations />
      <ExportPanel />
    </div>
  );
}
