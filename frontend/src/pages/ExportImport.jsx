import { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import { useToast } from "../components/common/Toast";

export default function ExportImport() {
  const [dragOver, setDragOver] = useState(false);
  const showToast = useToast();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Export / Import</h1>
        <p className="mt-1 text-sm text-ink-dim">Move prompts in and out of the toolkit.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-sm font-semibold text-ink">Import Prompts</h2>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); showToast("File received (demo only)"); }}
            className={`mt-4 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
              dragOver ? "border-violet-400/60 bg-violet-500/5" : "border-[var(--color-border-soft)]"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20">
              <Icon name="upload" size={22} className="text-violet-300" />
            </div>
            <p className="text-sm text-ink">Drag and drop a .json or .csv file here</p>
            <p className="text-xs text-ink-faint">or</p>
            <Button variant="secondary" size="sm" onClick={() => showToast("Browse dialog would open here")}>
              Browse Files
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-sm font-semibold text-ink">Export Prompts</h2>
          <p className="mt-2 text-sm text-ink-dim">Export your entire library or a selected set of prompts.</p>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border-soft)] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Icon name="file" size={18} className="text-cyan-300" />
                <div>
                  <p className="text-sm text-ink">Export as JSON</p>
                  <p className="text-xs text-ink-faint">Full fidelity, best for re-importing</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" icon="download" onClick={() => showToast("Exported library.json")}>
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border-soft)] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Icon name="file" size={18} className="text-rose-300" />
                <div>
                  <p className="text-sm text-ink">Export as PDF</p>
                  <p className="text-xs text-ink-faint">Readable report, good for sharing</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" icon="download" onClick={() => showToast("Exported library.pdf")}>
                Export
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
