import { motion } from "framer-motion";
import Card from "../common/Card";
import Button from "../common/Button";
import UploadZone from "./UploadZone";
import ValidationPanel from "./ValidationPanel";
import ImportSummary from "./ImportSummary";

export default function ImportCard({
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onBrowse,
  selectedFile,
  validationState,
  validationMessage,
  importSummary,
  onImport,
}) {
  const tone = validationState === "error" ? "error" : validationState === "warning" ? "warning" : "success";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
      <Card className="h-full border border-white/10 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Import</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-ink">Bring prompt collections into your workspace</h2>
            <p className="mt-2 text-sm leading-6 text-ink-dim">Upload a file, review validation feedback, and choose how duplicates should be handled.</p>
          </div>
        </div>

        <div className="mt-6">
          <UploadZone
            dragOver={dragOver}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onBrowse={onBrowse}
            fileName={selectedFile?.name || ""}
            fileSize={selectedFile?.size || ""}
            detectedFormat={selectedFile?.format || "Waiting for upload"}
            promptCount={selectedFile?.prompts || "—"}
            validationState={validationState}
            validationMessage={validationMessage}
            statusTone={tone}
          />
        </div>

        <div className="mt-6 space-y-3">
          {validationState && (
            <ValidationPanel
              tone={tone}
              title={validationState === "success" ? "Valid file detected" : validationState === "warning" ? "Needs attention" : "Import blocked"}
              message={validationMessage}
              details={selectedFile ? `${selectedFile.name} • ${selectedFile.format}` : ""}
            />
          )}

          
        </div>

        {importSummary && <div className="mt-6"><ImportSummary {...importSummary} /></div>}

        <Button variant="primary" size="lg" icon="upload" className="mt-6 w-full" onClick={onImport}>
          Import prompts
        </Button>
      </Card>
    </motion.div>
  );
}
