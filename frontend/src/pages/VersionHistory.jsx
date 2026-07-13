import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    commitMessage: "Locked the response format and clarified the decision output.",
    changes: ["Locked executive-ready formatting", "Added stronger confidence framing"],
    status: "Production",
    label: "Latest",
    qualityScore: 94,
    evaluationScore: 91,
    averageUserRating: 4.8,
    modelUsed: "Claude Sonnet 5",
    prompt: "Analyze churn-risk signals, identify likely causes, provide a concise action plan, and explain confidence in a business-friendly format.",
    variables: ["accountId", "segment", "lastInteractionDate", "productUsageTrend"],
    systemPrompt: "Act as a senior retention strategist. Prioritize evidence-backed recommendations and avoid speculation.",
    notes: "Optimized for executive delivery and reduced ambiguity.",
  },
  {
    id: "v5",
    version: "v5",
    name: "Decision-First Rewrite",
    timestamp: "1d ago",
    author: "Asha Rao",
    commitMessage: "Added confidence scoring and made the next step more actionable.",
    changes: ["Introduced confidence scoring", "Strengthened the recommended next step"],
    status: "Stable",
    label: "Best Performing",
    qualityScore: 92,
    evaluationScore: 89,
    averageUserRating: 4.6,
    modelUsed: "GPT-5",
    prompt: "Evaluate customer churn signals and provide a short diagnosis with confidence and recommended next steps.",
    variables: ["accountId", "churnReason", "supportTouchpoints"],
    systemPrompt: "Act as a product analyst. Return a compact summary with confidence and suggested interventions.",
    notes: "Improved actionability but increased token usage slightly.",
  },
  {
    id: "v4",
    version: "v4",
    name: "Role and Constraints Refinement",
    timestamp: "3d ago",
    author: "Devon Cole",
    commitMessage: "Introduced explicit role instructions and format constraints.",
    changes: ["Added role and constraint guidance", "Improved consistency but reduced flexibility"],
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
  },
  {
    id: "v3",
    version: "v3",
    name: "Clarity Boost",
    timestamp: "6d ago",
    author: "Priya Nair",
    commitMessage: "Rewrote the task description for clearer execution.",
    changes: ["Reframed the request for clarity", "Simplified the opening direction"],
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
  },
];

const activityFeed = [
  { id: 1, timestamp: "10 min ago", user: "Asha Rao", action: "Created version v6" },
  { id: 2, timestamp: "1h ago", user: "Devon Cole", action: "Compared v5 and v6" },
  { id: 3, timestamp: "3h ago", user: "Asha Rao", action: "Restored version v4" },
  { id: 4, timestamp: "5h ago", user: "Priya Nair", action: "Refined prompt variables" },
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

function StickyHeader({ selectedVersion }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-20 rounded-[28px] border border-[var(--color-border-hi)] bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.16),_transparent_30%),rgba(10,12,20,0.92)] px-4 py-4 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.85)] backdrop-blur xl:px-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-violet-200">
            <Icon name="clock" size={13} /> Prompt version history
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Prompt version history</h1>
          <p className="mt-2 text-sm leading-7 text-ink-dim">Track how the prompt evolved, compare revisions, and move the strongest version forward.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="emerald">Current {selectedVersion.version}</Badge>
          <Badge tone="violet">{selectedVersion.name}</Badge>
        </div>
      </div>
    </motion.header>
  );
}

function SearchToolbar({ search, setSearch, sortOrder, setSortOrder }) {
  return (
    <Card className="p-4 lg:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 lg:max-w-xl">
          <label className="text-sm text-ink-dim">Search versions</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--color-border-soft)] bg-black/20 px-3 py-2">
            <Icon name="search" size={15} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title, summary, or version" className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant={sortOrder === "newest" ? "primary" : "secondary"} size="sm" icon="clock" onClick={() => setSortOrder("newest")}>Newest first</Button>
          <Button variant={sortOrder === "oldest" ? "primary" : "secondary"} size="sm" icon="clock" onClick={() => setSortOrder("oldest")}>Oldest first</Button>
        </div>
      </div>
    </Card>
  );
}

function VersionTimeline({ versions, selectedVersionId, onSelect, onOpenDetails, onCompare, onRestore, onDelete }) {
  if (!versions.length) {
    return (
      <Card className="p-8 text-center">
        <h3 className="font-display text-lg font-semibold text-ink">No versions match your search</h3>
        <p className="mt-2 text-sm text-ink-dim">Try a broader search or reset the filters to see the full history.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle title="Timeline" subtitle="Each revision is shown as a compact, review-friendly commit card." />
        <Badge tone="emerald">{versions.length} versions</Badge>
      </div>

      <div className="mt-6 space-y-4">
        {versions.map((version, index) => {
          const isActive = version.id === selectedVersionId;
          return (
            <motion.div key={version.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
              <div className={`rounded-[24px] border p-4 transition-all ${isActive ? "border-violet-400/25 bg-violet-500/[0.06]" : "border-[var(--color-border-soft)] bg-white/[0.03]"}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <button onClick={() => onSelect(version.id)} className="max-w-2xl text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-semibold text-ink">{version.version}</span>
                      <Badge tone={statusTone(version.status)}>{version.status}</Badge>
                      <Badge tone="violet">{version.label}</Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium text-ink">{version.name}</p>
                    <p className="mt-2 text-sm leading-6 text-ink-dim">{version.commitMessage}</p>
                  </button>
                  <div className="text-sm text-ink-faint">
                    <p>{version.timestamp}</p>
                    <p className="mt-1">by {version.author}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3 text-sm text-ink-dim">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-ink-faint">Quality</p>
                    <p className="mt-1 font-semibold text-ink">{version.qualityScore}/100</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3 text-sm text-ink-dim">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-ink-faint">Evaluation</p>
                    <p className="mt-1 font-semibold text-ink">{version.evaluationScore}/100</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3 text-sm text-ink-dim">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-ink-faint">Rating</p>
                    <p className="mt-1 font-semibold text-ink">{version.averageUserRating}/5</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" icon="eye" onClick={() => onOpenDetails(version)}>View</Button>
                  <Button variant="secondary" size="sm" icon="swap" onClick={() => onCompare(version.id)}>Compare</Button>
                  <Button variant="secondary" size="sm" icon="restore" onClick={() => onRestore(version)}>Restore</Button>
                  <Button variant="secondary" size="sm" icon="trash" onClick={() => onDelete(version.id)}>Delete</Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

function VersionDrawer({ version, open, onClose }) {
  if (!version) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.aside initial={{ x: 320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 320, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 24 }} className="fixed right-0 top-0 z-50 h-full w-full max-w-xl border-l border-[var(--color-border-hi)] bg-[rgba(10,12,20,0.98)] p-4 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-ink-faint">Version details</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">{version.version} · {version.name}</h3>
              </div>
              <button onClick={onClose} className="rounded-xl border border-[var(--color-border-soft)] p-2 text-ink-dim hover:text-ink">
                <Icon name="x" size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-ink">System prompt</p>
                <p className="mt-2 text-sm leading-7 text-ink-dim">{version.systemPrompt}</p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-ink">User prompt</p>
                <p className="mt-2 text-sm leading-7 text-ink-dim">{version.prompt}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-ink">Prompt settings</p>
                  <div className="mt-3 space-y-2 text-sm text-ink-dim">
                    <div className="flex items-center justify-between"><span>Temperature</span><span className="font-semibold text-ink">0.7</span></div>
                    <div className="flex items-center justify-between"><span>Top P</span><span className="font-semibold text-ink">0.95</span></div>
                    <div className="flex items-center justify-between"><span>Max tokens</span><span className="font-semibold text-ink">2048</span></div>
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-ink">Metadata</p>
                  <div className="mt-3 space-y-2 text-sm text-ink-dim">
                    <div className="flex items-center justify-between"><span>Model</span><span className="font-semibold text-ink">{version.modelUsed}</span></div>
                    <div className="flex items-center justify-between"><span>Tags</span><span className="font-semibold text-ink">Retention, Ops</span></div>
                    <div className="flex items-center justify-between"><span>Created</span><span className="font-semibold text-ink">{version.timestamp}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CompareModal({ open, onClose, versionA, versionB }) {
  return (
    <Modal open={open} onClose={onClose} title="Compare versions" footer={<Button variant="secondary" size="sm" onClick={onClose}>Close</Button>}>
      <div className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
            <p className="text-sm font-semibold text-ink">{versionA?.version} · {versionA?.name}</p>
            <p className="mt-2 text-sm leading-7 text-ink-dim">{versionA?.prompt}</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
            <p className="text-sm font-semibold text-ink">{versionB?.version} · {versionB?.name}</p>
            <p className="mt-2 text-sm leading-7 text-ink-dim">{versionB?.prompt}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-ink">Metadata comparison</p>
          <div className="mt-3 grid gap-2 text-sm text-ink-dim sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--color-border-soft)] bg-black/20 p-3">Quality: {versionA?.qualityScore}/100 vs {versionB?.qualityScore}/100</div>
            <div className="rounded-xl border border-[var(--color-border-soft)] bg-black/20 p-3">Model: {versionA?.modelUsed} vs {versionB?.modelUsed}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function RestoreDialog({ open, onClose, version, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Restore version" footer={<><Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button><Button size="sm" onClick={onConfirm}>Restore</Button></>}>
      <div className="space-y-3 text-sm text-ink-dim">
        <p>The current version will stay stored, and <span className="font-semibold text-ink">{version?.version}</span> will become the latest revision.</p>
      </div>
    </Modal>
  );
}

function DeleteDialog({ open, onClose, version, onConfirm, canDelete }) {
  return (
    <Modal open={open} onClose={onClose} title="Delete version" footer={<><Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button><Button variant="danger" size="sm" onClick={onConfirm} disabled={!canDelete}>Delete</Button></>}>
      <div className="space-y-3 text-sm text-ink-dim">
        {canDelete ? <p>This will remove <span className="font-semibold text-ink">{version?.version}</span> from the timeline.</p> : <p>The last remaining version cannot be deleted.</p>}
      </div>
    </Modal>
  );
}

function ActivityFeed() {
  return (
    <Card className="p-4 lg:p-5">
      <SectionTitle title="Activity" subtitle="The recent actions around this prompt history." />
      <div className="mt-5 space-y-3">
        {activityFeed.map((item) => (
          <div key={item.id} className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 px-4 py-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{item.action}</p>
                <p className="mt-1 text-ink-dim">{item.user}</p>
              </div>
              <span className="text-xs text-ink-faint">{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function VersionHistory() {
  const [versions, setVersions] = useState(promptVersions);
  const [selectedVersionId, setSelectedVersionId] = useState(promptVersions[0].id);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [drawerVersion, setDrawerVersion] = useState(null);
  const [compareTarget, setCompareTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const selectedVersion = versions.find((item) => item.id === selectedVersionId) || versions[0];

  const filteredVersions = useMemo(() => {
    const next = versions.filter((item) => `${item.name} ${item.commitMessage} ${item.version}`.toLowerCase().includes(search.toLowerCase()));
    return sortOrder === "oldest" ? [...next].reverse() : next;
  }, [search, sortOrder, versions]);

  const handleCompare = (versionId) => {
    const target = versions.find((item) => item.id === versionId);
    setCompareTarget(target ? { oldVersion: selectedVersion, newVersion: target } : null);
  };

  const handleDelete = (versionId) => {
    if (versions.length <= 1) {
      setDeleteTarget(versions.find((item) => item.id === versionId) || null);
      return;
    }
    setVersions((prev) => {
      const next = prev.filter((item) => item.id !== versionId);
      setSelectedVersionId((current) => (current === versionId ? next[0]?.id ?? "" : current));
      return next;
    });
    setDeleteTarget(null);
  };

  const handleRestore = () => {
    setRestoreTarget(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-1 py-2 sm:px-2 lg:px-3">
      <StickyHeader selectedVersion={selectedVersion} />
      <SearchToolbar search={search} setSearch={setSearch} sortOrder={sortOrder} setSortOrder={setSortOrder} />
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <VersionTimeline versions={filteredVersions} selectedVersionId={selectedVersionId} onSelect={setSelectedVersionId} onOpenDetails={setDrawerVersion} onCompare={handleCompare} onRestore={setRestoreTarget} onDelete={setDeleteTarget} />
        </div>
        <div className="space-y-4">
          <Card className="p-4 lg:p-5">
            <SectionTitle title="Selected revision" subtitle="Quick context for the version you are reviewing." />
            <div className="mt-4 rounded-[24px] border border-[var(--color-border-soft)] bg-black/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={statusTone(selectedVersion.status)}>{selectedVersion.status}</Badge>
                <Badge tone="violet">{selectedVersion.label}</Badge>
              </div>
              <p className="mt-3 font-display text-lg font-semibold text-ink">{selectedVersion.name}</p>
              <p className="mt-2 text-sm leading-7 text-ink-dim">{selectedVersion.notes}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white/[0.03] p-3 text-sm text-ink-dim">
                <p className="text-[10px] uppercase tracking-[0.24em] text-ink-faint">Model</p>
                <p className="mt-1 font-semibold text-ink">{selectedVersion.modelUsed}</p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white/[0.03] p-3 text-sm text-ink-dim">
                <p className="text-[10px] uppercase tracking-[0.24em] text-ink-faint">Version</p>
                <p className="mt-1 font-semibold text-ink">{selectedVersion.version}</p>
              </div>
            </div>
          </Card>
          <ActivityFeed />
        </div>
      </div>

      <VersionDrawer version={drawerVersion} open={Boolean(drawerVersion)} onClose={() => setDrawerVersion(null)} />
      <CompareModal open={Boolean(compareTarget)} onClose={() => setCompareTarget(null)} versionA={compareTarget?.oldVersion} versionB={compareTarget?.newVersion} />
      <RestoreDialog open={Boolean(restoreTarget)} onClose={() => setRestoreTarget(null)} version={restoreTarget} onConfirm={handleRestore} />
      <DeleteDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} version={deleteTarget} onConfirm={() => handleDelete(deleteTarget?.id)} canDelete={versions.length > 1} />
    </div>
  );
}