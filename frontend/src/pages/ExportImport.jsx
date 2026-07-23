import api from "../services/api";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ExportCard from "../components/export-import/ExportCard";
import ImportCard from "../components/export-import/ImportCard";
import { useToast } from "../components/common/Toast";

const formatBytes = (size) => {
  if (size === undefined || size === null) return "—";
  const value = Number(size);
  if (!Number.isFinite(value)) return size;
  const units = ["B", "KB", "MB", "GB"];
  let index = 0;
  let current = value;
  while (current >= 1024 && index < units.length - 1) {
    current /= 1024;
    index += 1;
  }
  return `${current.toFixed(current >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

export default function ExportImport() {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("JSON");
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationState, setValidationState] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [importSummary, setImportSummary] = useState(null);
  const [promptCount, setPromptCount] = useState(0);
  const fileInputRef = useRef(null);
  const showToast = useToast();

  const handleFileSelection = async (file) => {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    const supported = ["json"];
    const detectedFormat =
  extension === "json" ? "JSON" : "Unsupported";

    let nextState = "success";
    let nextMessage = "Valid file detected. Prompt collection is ready for import.";

    if (!supported.includes(extension)) {
      nextState = "error";
      nextMessage = "Unsupported format. Please upload a JSON file.";
    } else if (file.size > 220000) {
      nextState = "warning";
      nextMessage = "Large file detected. Review prompt count before importing.";
    }
let promptCount = "—";

if (extension === "json") {
  try {
    const text = await file.text();
    const json = JSON.parse(text);

    if (Array.isArray(json)) {
      promptCount = json.length;
    } else if (typeof json === "object") {
      promptCount = 1;
    }
  } catch (error) {
    console.error("Invalid JSON:", error);
  }
}
    setSelectedFile({
  file,
  name: file.name,
  size: formatBytes(file.size),
  format: detectedFormat,
  prompts: promptCount,
});
    setValidationState(nextState);
    setValidationMessage(nextMessage);
    setImportSummary(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    handleFileSelection(file);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleExport = async () => {
  try {
    const response = await api.get("/export_import/export", {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/json",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "prompts_export.json";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    showToast("Prompts exported successfully", "success");
  } catch (error) {
    console.error(error);
    showToast("Export failed", "error");
  }
};

  const handleImport = async () => {
  if (!selectedFile?.file) {
    showToast("Select a JSON file first", "warning");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", selectedFile.file);

    const response = await api.post(
      "/export_import/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setImportSummary({
      imported: response.data.message,
    });

    showToast(response.data.message, "success");
  } catch (error) {
    console.error(error);
    showToast(
      error.response?.data?.detail || "Import failed",
      "error"
    );
  }
};
useEffect(() => {
  const fetchPromptCount = async () => {
    try {
      const response = await api.get("/library/");
      setPromptCount(response.data.length);
    } catch (error) {
      console.error("Failed to fetch prompt count:", error);
    }
  };

  fetchPromptCount();
}, []);
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="sticky top-0 z-20 -mx-2 rounded-3xl border border-white/10 bg-[rgba(10,12,20,0.8)]/80 px-4 py-4 backdrop-blur-xl sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">Export / Import</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Move prompt collections with confidence</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-dim">Package, validate, and bring prompts into the workspace through a clean, cloud-inspired workflow.</p>
      </motion.header>

      <div className="grid gap-6 xl:grid-cols-2">
        <ExportCard
  selectedFormat={selectedFormat}
  onFormatChange={setSelectedFormat}
  promptCount={promptCount}
  onExport={handleExport}
/>
        <ImportCard
          dragOver={dragOver}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onBrowse={handleBrowse}
          selectedFile={selectedFile}
          validationState={validationState}
          validationMessage={validationMessage}
          importSummary={importSummary}
          onImport={handleImport}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        hidden
        onChange={(event) => handleFileSelection(event.target.files?.[0])}
      />
    </div>
  );
}
