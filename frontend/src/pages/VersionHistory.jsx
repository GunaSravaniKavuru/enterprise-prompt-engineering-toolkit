import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { versionHistory } from "../data/dummyData";
import { useToast } from "../components/common/Toast";

export default function VersionHistory() {
  const showToast = useToast();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Prompt Version History</h1>
          <p className="mt-1 text-sm text-ink-dim">Customer Churn Diagnosis Agent · 5 versions</p>
        </div>
        <Button variant="secondary" size="sm" icon="columns" onClick={() => showToast("Comparing v4 and v5")}>
          Compare Versions
        </Button>
      </div>

      <div className="relative pl-6">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-400/40 via-cyan-400/20 to-transparent" />
        <div className="space-y-5">
          {versionHistory.map((v) => (
            <div key={v.id} className="relative">
              <span className="absolute -left-6 top-5 h-3 w-3 rounded-full border-2 border-[#0a0c14] bg-gradient-to-br from-violet-400 to-cyan-400" />
              <Card className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-semibold text-ink">{v.version}</span>
                    {v.label && <Badge tone={v.label === "Current" ? "emerald" : "violet"}>{v.label}</Badge>}
                  </div>
                  <span className="text-xs text-ink-faint">{v.time}</span>
                </div>
                <p className="mt-2 text-sm text-ink-dim">{v.note}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-ink-faint">by {v.author}</span>
                  {v.label !== "Current" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="restore"
                      onClick={() => showToast(`Restored ${v.version}`)}
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
