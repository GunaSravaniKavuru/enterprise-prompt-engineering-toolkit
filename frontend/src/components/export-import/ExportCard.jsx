import { motion } from "framer-motion";
import Card from "../common/Card";
import Button from "../common/Button";
import FormatSelector from "./FormatSelector";

export default function ExportCard({
  selectedFormat,
  onFormatChange,
  promptCount,
  onExport,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="h-full border border-white/10 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">Export</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-ink">Package prompts for sharing</h2>
            <p className="mt-2 text-sm leading-6 text-ink-dim">Choose the export format and include the details that matter for downstream reuse.</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-ink">Format</p>
          <div className="mt-3">
            <FormatSelector value={selectedFormat} onChange={onFormatChange} />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-dim">Prompts</span>
            <span className="font-medium text-ink">{promptCount}</span>
          </div>
          
        </div>

        <div className="mt-6 space-y-3 rounded-2xl border border-white/10 p-4">
          <label className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-3 text-sm text-ink">
            <span>Include prompt metadata</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/10 bg-transparent" />
          </label>
          
          
        </div>

        <Button variant="primary" size="lg" icon="download" className="mt-6 w-full" onClick={onExport}>
          Export prompts
        </Button>
      </Card>
    </motion.div>
  );
}
