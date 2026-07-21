import { motion } from "framer-motion";
import Icon from "../common/Icon";

export default function UploadZone({ dragOver, onDragOver, onDragLeave, onDrop, onBrowse, fileName, fileSize, detectedFormat, promptCount, validationState, validationMessage, statusTone }) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative overflow-hidden rounded-3xl border-2 border-dashed px-5 py-10 text-center transition-all ${
        dragOver ? "border-violet-400/60 bg-violet-500/10" : "border-white/10 bg-white/5"
      }`}
    >
      <motion.div
        animate={{ y: dragOver ? -3 : 0, scale: dragOver ? 1.01 : 1 }}
        transition={{ duration: 0.2 }}
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20"
      >
        <Icon name="upload" size={22} className="text-violet-300" />
      </motion.div>

      <p className="mt-5 text-lg font-semibold text-ink">Drop a prompt collection here</p>
      <p className="mt-2 text-sm text-ink-dim">JSON, Markdown, TXT, or CSV files are supported.</p>

      <button
        type="button"
        onClick={onBrowse}
        className="mt-5 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-white/15"
      >
        Browse files
      </button>

      {fileName && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[rgba(10,12,20,0.7)] p-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">{fileName}</p>
              <p className="mt-1 text-sm text-ink-dim">{fileSize}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone === "success" ? "bg-emerald-500/12 text-emerald-300" : statusTone === "warning" ? "bg-amber-500/12 text-amber-300" : "bg-rose-500/12 text-rose-300"}`}>
              {detectedFormat}
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.22em] text-ink-faint">Prompt count</p>
              <p className="mt-1 text-sm font-medium text-ink">{promptCount}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.22em] text-ink-faint">Status</p>
              <p className="mt-1 text-sm font-medium text-ink">{validationState}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.22em] text-ink-faint">Message</p>
              <p className="mt-1 text-sm font-medium text-ink">{validationMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
