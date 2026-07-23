import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/common/Card";
import QualityRing from "../components/common/QualityRing";
import Icon from "../components/common/Icon";
import Button from "../components/common/Button";
import api from "../services/api";

export default function PromptEvaluator() {
  const { state } = useLocation();
  const prompt = state?.prompt;

  const [customPrompt, setCustomPrompt] = useState(prompt?.content || "");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const overall = evaluationResult?.overall_score || 0;
  const metrics = evaluationResult?.metrics || [];
  const suggestions = evaluationResult?.suggestions || [];

  const handleEvaluateCustomPrompt = async () => {
    if (!customPrompt.trim() || loading) return;

    try {
      setLoading(true);
      setErrorMessage("");
const response = await api.post("/evaluator/", {
  prompt_id: prompt?.id || null,
  content: customPrompt.trim(),
});
      setEvaluationResult(response.data);
    } catch (error) {
      console.error("Evaluation failed:", error);
      setErrorMessage("Unable to evaluate the prompt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearCustomPrompt = () => {
    setCustomPrompt("");
    setEvaluationResult(null);
    setErrorMessage("");
  };

 const showResults =
  !loading &&
  !errorMessage &&
  evaluationResult !== null;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Prompt Evaluator</h1>
        <p className="mt-1 text-sm text-ink-dim">A structural quality breakdown of your current prompt.</p>
      </div>

      <Card className="p-5">
        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Prompt Content</label>
            <textarea
              rows="5"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your custom prompt"
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-slate-950/60 px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-cyan-400"
            />
            <p className="mt-2 text-xs text-ink-dim">
              Paste a prompt here or open a prompt from the Prompt Library to evaluate it.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="sm" onClick={handleEvaluateCustomPrompt} disabled={loading}>
              {loading ? (
                <>
                  <Icon name="refresh" size={15} className="animate-spin" />
                  Evaluating...
                </>
              ) : (
                "Evaluate Prompt"
              )}
            </Button>
            <Button size="sm" variant="secondary" onClick={handleClearCustomPrompt}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <Card className="mx-auto flex max-w-2xl flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
                <Icon name="refresh" size={22} className="animate-spin" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">Evaluating Prompt...</h2>
                <p className="mt-2 text-sm text-ink-dim">
                  Analyzing prompt quality with Gemini. This may take a few seconds.
                </p>
              </div>
            </Card>
          </motion.div>
        ) : errorMessage ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <Card className="mx-auto flex max-w-2xl flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
                <Icon name="x" size={24} />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">Evaluation Failed</h2>
                <p className="mt-2 text-sm text-ink-dim">Unable to evaluate the prompt. Please try again.</p>
              </div>
              <Button size="sm" onClick={handleEvaluateCustomPrompt}>
                Retry
              </Button>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {showResults && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-faint">Overall Compliance Score</p>
                <p className="mt-2 font-display text-4xl font-semibold text-ink">
                  {overall}
                  <span className="text-lg text-ink-faint">/100</span>
                </p>

                <div className="mt-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      overall >= 90
                        ? "bg-green-500/20 text-green-400"
                        : overall >= 80
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {overall >= 90 ? "Excellent" : overall >= 80 ? "Strong" : "Needs Improvement"}
                  </span>
                </div>

                <p className="mt-3 max-w-sm text-sm text-ink-dim">
                  Your prompt shows strong compliance with the 5-axis framework. Refining format clarity and task instructions can further improve performance.
                </p>

                <div className="mt-5">
                  <div className="h-2 w-full rounded-full bg-slate-700">
                    <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${overall}%` }} />
                  </div>
                </div>
              </div>
              <QualityRing score={overall} size={140} stroke={11} label="Overall" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.04 }}
            className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5"
          >
            {metrics.map((m) => (
              <Card
                key={m.label}
                className="flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <QualityRing score={m.value} size={64} stroke={6} />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-ink">{m.label}</p>

                  <p className="text-xs text-ink-dim">{m.description}</p>

                  <p className="text-xs text-ink-dim">Score: {m.value}/100</p>

                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      m.value >= 90
                        ? "bg-green-500/20 text-green-400"
                        : m.value >= 80
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {m.value >= 90 ? "Excellent" : m.value >= 80 ? "Strong" : "Needs Improvement"}
                  </span>
                </div>
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08 }}
          >
            <Card className="p-5">
              <h2 className="font-display text-sm font-semibold text-ink">Compliance Improvement Suggestions</h2>
              <ul className="mt-3 space-y-3">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/40 p-3 text-sm text-ink-dim"
                  >
                    <Icon name="sparkle" size={15} className="mt-0.5 shrink-0 text-amber-300" />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
