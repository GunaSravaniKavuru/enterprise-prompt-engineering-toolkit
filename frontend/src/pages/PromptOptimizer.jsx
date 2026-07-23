import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import QualityRing from "../components/common/QualityRing";
import api from "../services/api";
import { useToast } from "../components/common/Toast";

export default function PromptOptimizer() {
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGeneratedState, setShowGeneratedState] = useState(false);
  const scoreBefore = optimizationResult?.score_before || 0;
  const scoreAfter = optimizationResult?.score_after || 0;
  const summary = optimizationResult?.summary || [];
  const showToast = useToast();

  const handleGeneratePrompt = async () => {
  if (!originalPrompt.trim() || isGenerating) return;

  try {
    setIsGenerating(true);
    setShowGeneratedState(false);

    const response = await api.post("/optimizer", {
      prompt_id: null,
      original_content: originalPrompt.trim(),
    });

    setOptimizationResult(response.data);
    setOptimizedPrompt(response.data.optimized_content);

    setShowGeneratedState(true);

    setTimeout(() => {
      setShowGeneratedState(false);
    }, 1000);
  } catch (error) {
  console.error("Optimization failed:", error);

  if (error.response) {
    console.error("Response:", error.response.data);
  }

  showToast(
    error.response?.data?.detail || "Failed to optimize prompt."
  );
} finally {
  setIsGenerating(false);
}
};

  const handleCopy = async () => {
    if (!optimizedPrompt) return;

    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      showToast("Optimized prompt copied.");
    } catch {
      showToast("Unable to copy optimized prompt.");
    }
  };

  const handleSave = async () => {
  if (!optimizedPrompt) return;

  try {
    await api.post("/library", {
      title: originalPrompt.slice(0, 50) || "Optimized Prompt",
      category: "Optimizer",
      tags: ["optimized"],
      content: optimizedPrompt,
      technique: "Prompt Optimization",
      output_format: "Text",
      form_data: {},
    });

    showToast("Optimized prompt saved successfully.");
  } catch (error) {
    console.error(error);

    showToast(
      error.response?.data?.detail || "Failed to save prompt."
    );
  }
};

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white">
  Prompt Optimizer
</h1>

<p className="mt-3 max-w-3xl text-base leading-7 text-gray-400">
  Compare the original and optimized prompts to understand how better prompt engineering improves clarity, precision, and AI response quality.
</p>
        </div>
        <Button icon="sparkle" className="px-6 py-3 rounded-xl shadow-lg">Optimize Another Prompt</Button>
      </div>
<Card className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-faint">Before</p>
          <QualityRing score={scoreBefore} size={72} stroke={7} />
        </div>
        <div className="hidden md:block border-l border-slate-700 h-20 mx-auto"></div>
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-faint">After</p>
          <QualityRing score={scoreAfter} size={72} stroke={7} />
        </div>
        <div className="text-center md:col-span-3 mt-4 border-t border-slate-700 pt-4">
  <p className="text-xs uppercase tracking-wide text-ink-faint">
    Overall Improvement
  </p>

  <p className="mt-2 font-display text-4xl font-bold text-emerald-400">
    +{scoreAfter - scoreBefore}
  </p>
</div>
        </div> 
      </Card>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
      <Card className="flex h-full flex-col rounded-2xl border border-slate-700 bg-slate-900/60 p-8 shadow-lg transition-all duration-300 hover:border-cyan-500/40">
    <h2 className="font-display text-xl font-semibold text-white">
      Original Prompt
    </h2>

          <textarea
            value={originalPrompt}
            onChange={(event) => setOriginalPrompt(event.target.value)}
            rows={11}
            className="mt-4 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-6 text-sm leading-8 text-gray-300 outline-none transition-colors focus:border-violet-500/40"
            placeholder="Enter your original prompt here..."
          />

          <div className="mt-5 flex justify-center">
            <Button
              onClick={handleGeneratePrompt}
              disabled={!originalPrompt.trim() || isGenerating}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 shadow-[0_12px_28px_-16px_rgba(139,92,246,0.8)] hover:shadow-[0_14px_30px_-14px_rgba(139,92,246,0.9)]"
            >
              {isGenerating ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Generating...
                </span>
              ) : showGeneratedState ? (
                "✓ Generated"
              ) : (
                "Generate Prompt"
              )}
            </Button>
          </div>
  </Card>

  <Card className="flex h-full flex-col rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/20 to-slate-900 p-8 shadow-lg">
    <h2 className="font-display text-xl font-semibold text-violet-300">
      Optimized Prompt
    </h2>

          <div className="mt-4 flex-1">
          {!optimizedPrompt && !isGenerating && (
            <div className="flex h-full min-h-[356px] items-center rounded-xl border border-violet-500/20 bg-black/40 p-6 text-sm leading-8 text-white">
              <div>
                <p className="font-medium text-violet-200">✨ Your optimized prompt will appear here.</p>
                <p className="mt-3 text-gray-300">
                  Add your original prompt on the left, then click "Generate Prompt" to produce a clearer, more professional version.
                </p>
                <p className="mt-2 text-gray-400">
                  The output will be generated only when you explicitly run it.
                </p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="flex h-full min-h-[356px] items-center rounded-xl border border-violet-500/20 bg-black/40 p-6">
              <div className="flex items-center gap-3 text-sm text-violet-200">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-300/40 border-t-violet-200" />
                Optimizing prompt...
              </div>
            </div>
          )}

          <AnimatePresence>
            {!isGenerating && optimizedPrompt && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full min-h-[356px] rounded-xl border border-violet-500/20 bg-black/40 p-6 text-sm leading-8 text-white"
              >
                {optimizedPrompt}
              </motion.p>
            )}
          </AnimatePresence>
          </div>

          <div className="mt-5 flex gap-2">
            <Button variant="secondary" icon="copy" className="flex-1" disabled={!optimizedPrompt} onClick={handleCopy}>
              Copy
            </Button>
            <Button variant="secondary" icon="check" className="flex-1" disabled={!optimizedPrompt} onClick={handleSave}>
              Save
            </Button>
          </div>
  </Card>
</div>

      <Card className="rounded-3xl border border-slate-700 bg-slate-900/70 p-8 shadow-xl">
        <h2 className="font-display text-xl font-semibold text-white">Improvement Summary</h2>
       <ul className="mt-6 space-y-4">
          {summary.map((s, i) => (
           <li
  key={i}
  className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-base text-gray-200 transition-all hover:border-violet-500/40"
>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                <Icon name="check" size={16} className="text-emerald-400" />
              </span>
              {s}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
