import api from "../../services/api";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Card from "../common/Card";
import Button from "../common/Button";
import Icon from "../common/Icon";
import Badge from "../common/Badge";



const modelCatalog = [
  {
    id: "gemini:3.6-flash",
    name: "Gemini 3.6 Flash",
  },
  {
    id: "gemini:3.5-flash-lite",
    name: "Gemini 3.5 Flash Lite",
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
      className="border-b border-[var(--color-border-soft)] bg-transparent px-5 py-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
  <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-violet-200">
    <Icon name="gauge" size={13} />
    MULTI MODEL COMPARISON
  </div>

  <h1 className="mt-4 text-4xl font-bold text-ink">
    Multi-Model Comparison
  </h1>

  <p className="mt-2 text-base text-ink-dim">
    Compare responses from multiple AI models using your saved prompts.
  </p>
</div>
        <div className="flex flex-wrap gap-2">
          
          
        </div>
      </div>
    </motion.header>
  );
}

function ComparisonConfigCard({
  prompt,
  setPrompt,
  selectedModels,
  toggleModel,
  onRun,
  promptOptions,
}){
  const selectedPrompt =
  promptOptions.find((item) => item.id === prompt) ||
  promptOptions[0];

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
         <select
  value={prompt}
  onChange={(event) => setPrompt(Number(event.target.value))}
  className="w-full rounded-lg border border-gray-600 bg-[#181a20] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
>
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


function ComparisonResults({ results, onCopy, onDownload }) {
  const gridClass =
    results.length === 1
      ? "grid-cols-1"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {results.map((result, index) => (
        <motion.article
          key={result.model}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className="flex h-full flex-col rounded-[24px] border border-[var(--color-border-soft)] bg-white/[0.03] p-4 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.65)]"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-ink">
              {result.model}
            </h3>

            <Badge tone={result.status === "success" ? "emerald" : "amber"}>
              {result.status}
            </Badge>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3 text-sm">
              <div className="flex justify-between">
                <span>Latency</span>
                <span>{result.latency_ms} ms</span>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Total Tokens</span>
                <span>{result.total_tokens}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-3 text-sm">
              <div className="flex justify-between">
                <span>Input Tokens</span>
                <span>{result.input_tokens}</span>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Output Tokens</span>
                <span>{result.output_tokens}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-[var(--color-border-soft)] bg-slate-950/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-ink">
                Generated Output
              </p>
            </div>

            <div
              className="max-h-60 overflow-auto rounded-2xl border border-white/10 bg-slate-950/80 p-3"
              dangerouslySetInnerHTML={renderMarkdown(result.output)}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon="copy"
              onClick={() => onCopy(result)}
            >
              Copy
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon="download"
              onClick={() => onDownload(result)}
            >
              Download
            </Button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export default function ComparisonWorkspace() {
  const [promptOptions, setPromptOptions] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState([
  "gemini:3.6-flash",
  "gemini:3.5-flash-lite",
]);
  
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const loadPrompts = async () => {
    try {
      const response = await api.get("/library/");
      console.log(
  response.data.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
  }))
);
      const uniquePrompts = [];
const seenTitles = new Set();

response.data.forEach((item) => {
  if (!seenTitles.has(item.title)) {
    seenTitles.add(item.title);

    uniquePrompts.push({
      id: item.id,
      title: item.title,
      description: item.content,
    });
  }
});

const prompts = uniquePrompts;

      setPromptOptions(prompts);

      if (prompts.length > 0) {
        setPrompt(prompts[0].id);
      }
    } catch (error) {
      console.error("Failed to load prompts:", error);
    } finally {
      setIsLoading(false);
      setResults([]);
    }
  };

  loadPrompts();
}, []);

  const currentPrompt = useMemo(
  () => promptOptions.find((item) => item.id === prompt) || promptOptions[0] || { description: "" },
  [prompt, promptOptions]
);

  const toggleModel = (modelId) => {
    setSelectedModels((current) => (current.includes(modelId) ? current.filter((item) => item !== modelId) : [...current, modelId]));
  };

  

  const handleRunComparison = async () => {
  if (selectedModels.length < 2) {
    alert("Please select at least two models.");
    return;
  }

  try {
    setIsLoading(true);

    const response = await api.post("/comparison/side-by-side", {
      prompt_id: prompt,
      prompt_text: currentPrompt.description,
      models: selectedModels,
    });

    setResults(response.data.results);
  } catch (error) {
    console.error("Comparison failed:", error);
    alert("Comparison failed.");
  } finally {
    setIsLoading(false);
  }
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
    link.download = `${result.model.toLowerCase().replace(/\s+/g, "-")}-response.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-2 sm:px-6 lg:px-8">
     <StickyHeader
title="Multi-Model Comparison"
description="Compare responses from multiple AI models using your saved prompts."
onCompare={handleRunComparison}
onClear={handleClearResults}
hasResults={results.length > 0}
/>
      <div className="flex flex-col gap-4">
        <ComparisonConfigCard
  prompt={prompt}
  setPrompt={setPrompt}
  selectedModels={selectedModels}
  toggleModel={toggleModel}
  onRun={handleRunComparison}
  promptOptions={promptOptions}
/>
        
        {isLoading ? <LoadingState /> : results.length ? <ComparisonResults results={results} onCopy={handleCopy} onDownload={handleDownload} /> : <EmptyState onRun={handleRunComparison} />}
      </div>
      
    </div>
  );
}

