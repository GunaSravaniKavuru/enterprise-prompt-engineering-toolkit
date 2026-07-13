import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import Modal from "../components/common/Modal";

const promptVersions = [
  {
    id: "v6",
    version: "v6",
    name: "Production Readiness Pass",
    timestamp: "2h ago",
    author: "Asha Rao",
    commitMessage: "Locked output format and increased decision clarity",
    changes: [
      "Locked the response format for executive review",
      "Added explicit decision clarity and confidence framing",
    ],
    status: "Production",
    label: "Latest",
    qualityScore: 94,
    evaluationScore: 91,
    averageUserRating: 4.8,
    modelUsed: "Claude Sonnet 5",
    prompt:
      "Analyze churn-risk signals, identify likely causes, provide a concise action plan, and explain confidence in a business-friendly format.",
    variables: ["accountId", "segment", "lastInteractionDate", "productUsageTrend"],
    systemPrompt:
      "Act as a senior retention strategist. Prioritize evidence-backed recommendations and avoid speculation.",
    notes: "Optimized for executive delivery and reduced ambiguity.",
    metrics: {
      quality: 94,
      reasoning: 93,
      clarity: 95,
      completeness: 92,
      latency: 1.6,
      tokens: 1800,
      cost: 0.018,
      hallucinationRisk: 6,
      overallScore: 93,
    },
  },
  {
    id: "v5",
    version: "v5",
    name: "Decision-First Rewrite",
    timestamp: "1d ago",
    author: "Asha Rao",
    commitMessage: "Added confidence scoring and stronger call to action",
    changes: [
      "Introduced confidence scoring for recommendations",
      "Made the next-step guidance more actionable",
    ],
    status: "Stable",
    label: "Best Performing",
    qualityScore: 92,
    evaluationScore: 89,
    averageUserRating: 4.6,
    modelUsed: "GPT-5",
    prompt:
      "Evaluate customer churn signals and provide a short diagnosis with confidence and recommended next steps.",
    variables: ["accountId", "churnReason", "supportTouchpoints"],
    systemPrompt:
      "Act as a product analyst. Return a compact summary with confidence and suggested interventions.",
    notes: "Improved actionability but increased token usage slightly.",
    metrics: {
      quality: 92,
      reasoning: 90,
      clarity: 91,
      completeness: 90,
      latency: 1.8,
      tokens: 2000,
      cost: 0.020,
      hallucinationRisk: 8,
      overallScore: 90,
    },
  },
  {
    id: "v4",
    version: "v4",
    name: "Role and Constraints Refinement",
    timestamp: "3d ago",
    author: "Devon Cole",
    commitMessage: "Introduced explicit role instructions and format constraints",
    changes: [
      "Added explicit role and constraint instructions",
      "Improved consistency but reduced flexibility",
    ],
    status: "Archived",
    label: "Archived",
    qualityScore: 88,
    evaluationScore: 84,
    averageUserRating: 4.1,
    modelUsed: "Gemini 2.5 Pro",
    prompt: "You are a retention specialist. Analyze churn-risk signals and recommend a next action.",
    variables: ["customerEmail", "usageHistory"],
    systemPrompt: "You are a retention specialist. Keep recommendations concise and practical.",
    notes: "Good clarity, but it lacked evaluation guardrails.",
    metrics: {
      quality: 88,
      reasoning: 86,
      clarity: 89,
      completeness: 84,
      latency: 1.2,
      tokens: 1600,
      cost: 0.016,
      hallucinationRisk: 12,
      overallScore: 85,
    },
  },
  {
    id: "v3",
    version: "v3",
    name: "Clarity Boost",
    timestamp: "6d ago",
    author: "Priya Nair",
    commitMessage: "Rewrote the task description for clearer execution",
    changes: [
      "Reframed the request for clarity",
      "Simplified the direction for the first draft",
    ],
    status: "Draft",
    label: "Draft",
    qualityScore: 82,
    evaluationScore: 78,
    averageUserRating: 3.9,
    modelUsed: "GPT-5",
    prompt: "Summarize the churn signal and offer a recommendation for the account team.",
    variables: ["accountSummary"],
    systemPrompt: "Help the account team make a quick decision.",
    notes: "A useful early draft that was later expanded for higher confidence.",
    metrics: {
      quality: 82,
      reasoning: 79,
      clarity: 84,
      completeness: 77,
      latency: 1.9,
      tokens: 1400,
      cost: 0.015,
      hallucinationRisk: 15,
      overallScore: 80,
    },
  },
];

const activityFeed = [
  { id: 1, timestamp: "10 min ago", user: "Asha Rao", action: "Created prompt version v6" },
  { id: 2, timestamp: "1h ago", user: "Devon Cole", action: "Compared v5 and v6" },
  { id: 3, timestamp: "3h ago", user: "Asha Rao", action: "Restored version v4" },
  { id: 4, timestamp: "5h ago", user: "Priya Nair", action: "Optimized prompt variables" },
  { id: 5, timestamp: "8h ago", user: "System", action: "Exported comparison report" },
];

const evolutionSteps = [
  { version: "v1", title: "Initial prompt", detail: "Basic churn diagnosis" },
  { version: "v3", title: "Clarity boost", detail: "Improved task framing" },
  { version: "v5", title: "Decision-led rewrite", detail: "Added confidence and actionability" },
  { version: "v6", title: "Production-ready", detail: "Locked format and quality signals" },
];

const performanceSeries = [
  { metric: "Quality", v5: 92, v6: 94 },
  { metric: "Reasoning", v5: 90, v6: 93 },
  { metric: "Clarity", v5: 91, v6: 95 },
  { metric: "Completeness", v5: 90, v6: 92 },
  { metric: "Latency", v5: 1.8, v6: 1.6 },
];

const diffBlocks = [
  {
    type: "added",
    label: "Added",
    content: "A confidence section and a business-friendly output format.",
  },
  {
    type: "removed",
    label: "Removed",
    content: "A generic summary block that was too vague for decision-makers.",
  },
  {
    type: "modified",
    label: "Modified",
    content: "The prompt now asks for concise next steps instead of a wide-ranging analysis.",
  },
];

function statusTone(status) {
  if (status === "Production") return "emerald";
  if (status === "Stable") return "cyan";
  if (status === "Archived") return "amber";
  return "violet";
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-ink-dim">{subtitle}</p>
    </div>
  );
}

function PromptHeader({ selectedVersion }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[24px] border border-[var(--color-border-hi)] bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.16),_transparent_28%),rgba(16,18,28,0.95)] p-3 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.85)] sm:p-4 lg:p-5"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-violet-200">
            <Icon name="clock" size={13} /> Prompt version intelligence
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">Prompt Version History</h1>
          <p className="mt-3 text-sm leading-7 text-ink-dim sm:text-[15px]">
            Follow how the prompt evolved, compare stronger versions, and decide when a previous revision should become the new default.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white/[0.03] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Prompt</p>
              <p className="mt-1 text-sm font-semibold text-ink">Customer Churn Diagnosis Agent</p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white/[0.03] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Model</p>
              <p className="mt-1 text-sm font-semibold text-ink">{selectedVersion.modelUsed}</p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white/[0.03] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Current version</p>
              <p className="mt-1 text-sm font-semibold text-ink">{selectedVersion.version}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" icon="edit">Edit Prompt</Button>
          <Button variant="secondary" size="sm" icon="play">Run Prompt</Button>
          <Button variant="secondary" size="sm" icon="columns">Compare Models</Button>
          <Button variant="secondary" size="sm" icon="download">Export</Button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Prompt metadata</p>
              <h2 className="mt-1 font-display text-lg font-semibold text-ink">{selectedVersion.name}</h2>
            </div>
            <Badge tone={statusTone(selectedVersion.status)}>{selectedVersion.status}</Badge>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3 text-sm text-ink-dim">
              <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Created by</p>
              <p className="mt-2 font-medium text-ink">Asha Rao</p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3 text-sm text-ink-dim">
              <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Last modified</p>
              <p className="mt-2 font-medium text-ink">{selectedVersion.timestamp}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="violet">Tags: retention</Badge>
            <Badge tone="cyan">Tags: churn</Badge>
            <Badge tone="emerald">Tags: ops</Badge>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Version snapshot</p>
          <div className="mt-4 space-y-3 text-sm text-ink-dim">
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--color-border-soft)] bg-black/20 px-3 py-2">
              <span>Quality score</span>
              <span className="font-semibold text-ink">{selectedVersion.qualityScore}/100</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--color-border-soft)] bg-black/20 px-3 py-2">
              <span>Evaluation</span>
              <span className="font-semibold text-ink">{selectedVersion.evaluationScore}/100</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--color-border-soft)] bg-black/20 px-3 py-2">
              <span>Avg. rating</span>
              <span className="font-semibold text-ink">{selectedVersion.averageUserRating}/5</span>
            </div>
          </div>
        </Card>
      </div>
    </motion.section>
  );
}

function FilterPanel({ search, setSearch, authorFilter, setAuthorFilter, statusFilter, setStatusFilter, versionFilter, setVersionFilter, modelFilter, setModelFilter, scoreFilter, setScoreFilter, allVersions }) {
  const authors = ["All", ...Array.from(new Set(allVersions.map((item) => item.author)))];
  const statuses = ["All", ...Array.from(new Set(allVersions.map((item) => item.status)))];
  const versions = ["All", ...Array.from(new Set(allVersions.map((item) => item.version)))];
  const models = ["All", ...Array.from(new Set(allVersions.map((item) => item.modelUsed)))];

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full lg:max-w-sm">
          <label className="text-sm text-ink-dim">Search history</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--color-border-soft)] bg-black/20 px-3 py-2">
            <Icon name="search" size={15} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by message or version" className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint" />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
          <select value={authorFilter} onChange={(event) => setAuthorFilter(event.target.value)} className="rounded-xl border border-[var(--color-border-soft)] bg-[#12141f] px-3 py-2 text-sm text-ink focus-ring">
            {authors.map((item) => <option key={item} value={item}>{item === "All" ? "All authors" : item}</option>)}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-[var(--color-border-soft)] bg-[#12141f] px-3 py-2 text-sm text-ink focus-ring">
            {statuses.map((item) => <option key={item} value={item}>{item === "All" ? "All statuses" : item}</option>)}
          </select>
          <select value={versionFilter} onChange={(event) => setVersionFilter(event.target.value)} className="rounded-xl border border-[var(--color-border-soft)] bg-[#12141f] px-3 py-2 text-sm text-ink focus-ring">
            {versions.map((item) => <option key={item} value={item}>{item === "All" ? "All versions" : item}</option>)}
          </select>
          <select value={modelFilter} onChange={(event) => setModelFilter(event.target.value)} className="rounded-xl border border-[var(--color-border-soft)] bg-[#12141f] px-3 py-2 text-sm text-ink focus-ring">
            {models.map((item) => <option key={item} value={item}>{item === "All" ? "All models" : item}</option>)}
          </select>
          <select value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)} className="rounded-xl border border-[var(--color-border-soft)] bg-[#12141f] px-3 py-2 text-sm text-ink focus-ring">
            <option value="All">All scores</option>
            <option value="90+">90+</option>
            <option value="80-89">80-89</option>
          </select>
        </div>
      </div>
    </Card>
  );
}

function VersionTimeline({ versions, selectedVersionId, onSelect, onRestore, onCompare, onDelete }) {
  return (
    <Card className="p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle title="Version timeline" subtitle="Select a revision to inspect its prompt, notes, and scoring." />
        <Badge tone="emerald">{versions.length} revisions</Badge>
      </div>

      <div className="relative mt-6 pl-6">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-400/45 via-cyan-400/20 to-transparent" />
        <div className="space-y-4">
          {versions.map((version) => {
            const isActive = version.id === selectedVersionId;
            return (
              <div key={version.id} className="relative">
                <span className={`absolute -left-6 top-5 h-3 w-3 rounded-full border-2 border-[#0a0c14] ${isActive ? "bg-gradient-to-br from-violet-400 to-cyan-400" : "bg-white/20"}`} />
                <motion.div whileHover={{ y: -1 }}>
                  <Card className={`p-4 transition-all ${isActive ? "border-violet-400/25" : ""}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <button onClick={() => onSelect(version.id)} className="max-w-2xl text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-sm font-semibold text-ink">{version.version}</span>
                          <Badge tone={statusTone(version.status)}>{version.status}</Badge>
                          <Badge tone="violet">{version.label}</Badge>
                        </div>
                        <p className="mt-2 text-sm font-medium text-ink">{version.name}</p>
                        <p className="mt-2 text-sm leading-6 text-ink-dim">{version.commitMessage}</p>
                      </button>
                      <div className="text-right text-xs text-ink-faint">
                        <p>{version.timestamp}</p>
                        <p className="mt-1">by {version.author}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 px-3 py-2 text-sm text-ink-dim">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-ink-faint">Quality</p>
                        <p className="mt-1 font-semibold text-ink">{version.qualityScore}/100</p>
                      </div>
                      <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 px-3 py-2 text-sm text-ink-dim">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-ink-faint">Eval</p>
                        <p className="mt-1 font-semibold text-ink">{version.evaluationScore}/100</p>
                      </div>
                      <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 px-3 py-2 text-sm text-ink-dim">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-ink-faint">Rating</p>
                        <p className="mt-1 font-semibold text-ink">{version.averageUserRating}/5</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-ink-faint">Changes</p>
                      <ul className="mt-2 space-y-1.5 text-sm text-ink-dim">
                        {(version.changes || [version.commitMessage]).map((change) => (
                          <li key={change} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" icon="check" onClick={() => onSelect(version.id)}>Select</Button>
                      <Button variant="secondary" size="sm" icon="swap" onClick={() => onCompare(version.id)}>Compare</Button>
                      <Button variant="secondary" size="sm" icon="restore" onClick={() => onRestore(version)}>Restore</Button>
                      <Button variant="secondary" size="sm" icon="trash" onClick={() => onDelete(version.id)}>Delete</Button>
                    </div>
                  </Card>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function VersionDetails({ version, openSections, toggleSection }) {
  return (
    <Card className="p-4 lg:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SectionTitle title="Version details" subtitle="Inspect the selected revision and its supporting context." />
        <Badge tone={statusTone(version.status)}>{version.version}</Badge>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <button onClick={() => toggleSection("prompt")} className="flex w-full items-center justify-between text-left">
            <span className="font-semibold text-ink">Full prompt</span>
            <Icon name="chevronRight" size={16} className={openSections.prompt ? "rotate-90" : ""} />
          </button>
          {openSections.prompt && <p className="mt-3 text-sm leading-7 text-ink-dim">{version.prompt}</p>}
        </div>

        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <button onClick={() => toggleSection("vars")} className="flex w-full items-center justify-between text-left">
            <span className="font-semibold text-ink">Variables</span>
            <Icon name="chevronRight" size={16} className={openSections.vars ? "rotate-90" : ""} />
          </button>
          {openSections.vars && (
            <div className="mt-3 flex flex-wrap gap-2">
              {version.variables.map((variable) => (
                <span key={variable} className="rounded-full border border-[var(--color-border-soft)] bg-white/[0.03] px-2.5 py-1 text-sm text-ink-dim">{variable}</span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <button onClick={() => toggleSection("system")} className="flex w-full items-center justify-between text-left">
            <span className="font-semibold text-ink">System prompt</span>
            <Icon name="chevronRight" size={16} className={openSections.system ? "rotate-90" : ""} />
          </button>
          {openSections.system && <p className="mt-3 text-sm leading-7 text-ink-dim">{version.systemPrompt}</p>}
        </div>

        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <button onClick={() => toggleSection("notes")} className="flex w-full items-center justify-between text-left">
            <span className="font-semibold text-ink">Notes</span>
            <Icon name="chevronRight" size={16} className={openSections.notes ? "rotate-90" : ""} />
          </button>
          {openSections.notes && <p className="mt-3 text-sm leading-7 text-ink-dim">{version.notes}</p>}
        </div>
      </div>
    </Card>
  );
}

function PromptDiffViewer({ versionA, versionB, viewMode, setViewMode, ignoreWhitespace, setIgnoreWhitespace }) {
  return (
    <Card className="p-4 lg:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle title="Prompt difference viewer" subtitle="Compare any two versions and understand what changed." />
        <div className="flex flex-wrap gap-2">
          <div className="rounded-xl border border-[var(--color-border-soft)] bg-black/20 p-1">
            <button onClick={() => setViewMode("side-by-side")} className={`rounded-lg px-3 py-1.5 text-sm ${viewMode === "side-by-side" ? "bg-violet-500/15 text-violet-200" : "text-ink-dim"}`}>Side-by-side</button>
            <button onClick={() => setViewMode("inline")} className={`rounded-lg px-3 py-1.5 text-sm ${viewMode === "inline" ? "bg-violet-500/15 text-violet-200" : "text-ink-dim"}`}>Inline</button>
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-[var(--color-border-soft)] bg-black/20 px-3 py-2 text-sm text-ink-dim">
            <input type="checkbox" checked={ignoreWhitespace} onChange={() => setIgnoreWhitespace((value) => !value)} />
            Ignore whitespace
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <p className="text-sm font-semibold text-ink">{versionA.version} · {versionA.name}</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink-dim">{versionA.prompt}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <p className="text-sm font-semibold text-ink">{versionB.version} · {versionB.name}</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink-dim">{versionB.prompt}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {diffBlocks.map((entry) => (
          <div key={entry.label} className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
            <div className="flex items-center gap-2">
              <Badge tone={entry.type === "added" ? "emerald" : entry.type === "removed" ? "rose" : "amber"}>{entry.label}</Badge>
              <p className="text-sm text-ink-dim">{entry.content}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AIChangeSummary({ versionA, versionB }) {
  return (
    <Card className="p-4 lg:p-5">
      <SectionTitle title="AI change summary" subtitle="An AI review of how the prompt changed and what it means for output quality." />
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <p className="text-sm font-semibold text-ink">What changed?</p>
          <p className="mt-3 text-sm leading-7 text-ink-dim">The newer version introduces explicit instructions for confidence, actionability, and business-friendly structure. It also removes vague phrasing that could lead to overly generic responses.</p>
          <p className="mt-4 text-sm font-semibold text-ink">Why it improved</p>
          <p className="mt-2 text-sm leading-7 text-ink-dim">It narrows the output shape, which improves consistency and makes the response better suited to stakeholder review.</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
          <p className="text-sm font-semibold text-ink">Expected impact</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-dim">
            <li>• Better precision and actionability.</li>
            <li>• Slightly higher token usage but stronger structure.</li>
            <li>• Lower hallucination risk for executive-facing prompts.</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="emerald">Advantages</Badge>
            <Badge tone="cyan">Risks</Badge>
            <Badge tone="violet">Suggested improvements</Badge>
          </div>
          <p className="mt-4 text-sm leading-7 text-ink-dim">Suggested next step: add one example of a strong response to further anchor model behavior.</p>
        </div>
      </div>
    </Card>
  );
}

function PerformanceComparison() {
  return (
    <Card className="p-4 lg:p-5">
      <SectionTitle title="Performance comparison" subtitle="Track how the latest version improves quality and efficiency." />
      <div className="mt-5 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceSeries}>
            <CartesianGrid stroke="rgba(148,156,199,0.08)" vertical={false} />
            <XAxis dataKey="metric" tick={{ fontSize: 11, fill: "#6a6f85" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#6a6f85" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="v5" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="v6" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function RestoreDialog({ open, onClose, version, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Restore version" footer={
      <>
        <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={onConfirm}>Restore</Button>
      </>
    }>
      <div className="space-y-3 text-sm text-ink-dim">
        <p>This will make <span className="font-semibold text-ink">{version?.version}</span> the latest version and keep the history intact.</p>
        <p>Existing later versions will remain available, but the selected revision will become the active prompt.</p>
      </div>
    </Modal>
  );
}

function ActivityTimeline() {
  return (
    <Card className="p-4 lg:p-5">
      <SectionTitle title="Activity history" subtitle="A lightweight feed of what changed around this prompt." />
      <div className="mt-5 space-y-3">
        {activityFeed.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--color-border-soft)] bg-black/20 px-4 py-3 text-sm">
            <div>
              <p className="font-medium text-ink">{item.action}</p>
              <p className="mt-1 text-ink-dim">{item.user}</p>
            </div>
            <span className="text-xs text-ink-faint">{item.timestamp}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EvolutionGraph() {
  return (
    <Card className="p-4 lg:p-5">
      <SectionTitle title="Prompt evolution" subtitle="The major milestones in this prompt’s journey." />
      <div className="mt-5 space-y-3">
        {evolutionSteps.map((step, index) => (
          <div key={step.version} className="flex items-center gap-3 rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-200">{index + 1}</div>
            <div>
              <p className="font-semibold text-ink">{step.version} · {step.title}</p>
              <p className="mt-1 text-sm text-ink-dim">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ExportPanel() {
  return (
    <Card className="p-4 lg:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SectionTitle title="Export" subtitle="Share a single version, the full history, or a comparison report." />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" icon="download">PDF</Button>
          <Button variant="secondary" size="sm" icon="download">Markdown</Button>
          <Button variant="secondary" size="sm" icon="download">JSON</Button>
          <Button variant="secondary" size="sm" icon="download">CSV</Button>
        </div>
      </div>
    </Card>
  );
}

export default function VersionHistory() {
  const [versions, setVersions] = useState(promptVersions);
  const [selectedVersionId, setSelectedVersionId] = useState(promptVersions[0].id);
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [versionFilter, setVersionFilter] = useState("All");
  const [modelFilter, setModelFilter] = useState("All");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [compareA, setCompareA] = useState("v5");
  const [compareB, setCompareB] = useState("v6");
  const [viewMode, setViewMode] = useState("side-by-side");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [openSections, setOpenSections] = useState({ prompt: true, vars: true, system: true, notes: true });

  const selectedVersion = versions.find((item) => item.id === selectedVersionId) || versions[0];
  const versionA = versions.find((item) => item.id === compareA) || versions[1] || versions[0];
  const versionB = versions.find((item) => item.id === compareB) || versions[0];

  const filteredVersions = useMemo(() => {
    return versions.filter((item) => {
      const matchSearch = `${item.name} ${item.commitMessage} ${item.version}`.toLowerCase().includes(search.toLowerCase());
      const matchAuthor = authorFilter === "All" || item.author === authorFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      const matchVersion = versionFilter === "All" || item.version === versionFilter;
      const matchModel = modelFilter === "All" || item.modelUsed === modelFilter;
      const matchScore = scoreFilter === "All" || (scoreFilter === "90+" && item.qualityScore >= 90) || (scoreFilter === "80-89" && item.qualityScore >= 80 && item.qualityScore < 90);
      return matchSearch && matchAuthor && matchStatus && matchVersion && matchModel && matchScore;
    });
  }, [search, authorFilter, statusFilter, versionFilter, modelFilter, scoreFilter, versions]);

  const toggleSection = (key) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleCompare = (versionId) => {
    setCompareA(selectedVersionId);
    setCompareB(versionId);
  };

  const handleDelete = (versionId) => {
    if (versions.length <= 1) return;
    setVersions((prev) => {
      const next = prev.filter((item) => item.id !== versionId);
      setSelectedVersionId((current) => (current === versionId ? next[0]?.id ?? "" : current));
      setCompareA((current) => (current === versionId ? next[0]?.id ?? "" : current));
      setCompareB((current) => (current === versionId ? next[0]?.id ?? "" : current));
      return next;
    });
  };

  return (
    <div className="mx-auto w-full max-w-none space-y-4 px-1 sm:px-2 lg:px-3 xl:px-0">
      <PromptHeader selectedVersion={selectedVersion} />
      <FilterPanel search={search} setSearch={setSearch} authorFilter={authorFilter} setAuthorFilter={setAuthorFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} versionFilter={versionFilter} setVersionFilter={setVersionFilter} modelFilter={modelFilter} setModelFilter={setModelFilter} scoreFilter={scoreFilter} setScoreFilter={setScoreFilter} allVersions={versions} />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <VersionTimeline versions={filteredVersions} selectedVersionId={selectedVersionId} onSelect={setSelectedVersionId} onRestore={setRestoreTarget} onCompare={handleCompare} onDelete={handleDelete} />
          <VersionDetails version={selectedVersion} openSections={openSections} toggleSection={toggleSection} />
          <PromptDiffViewer versionA={versionA} versionB={versionB} viewMode={viewMode} setViewMode={setViewMode} ignoreWhitespace={ignoreWhitespace} setIgnoreWhitespace={setIgnoreWhitespace} />
          <AIChangeSummary versionA={versionA} versionB={versionB} />
          <PerformanceComparison />
        </div>
        <div className="space-y-4">
          <ActivityTimeline />
          <EvolutionGraph />
          <ExportPanel />
        </div>
      </div>

      <RestoreDialog open={Boolean(restoreTarget)} onClose={() => setRestoreTarget(null)} version={restoreTarget} onConfirm={() => { setRestoreTarget(null); }} />
    </div>
  );
}