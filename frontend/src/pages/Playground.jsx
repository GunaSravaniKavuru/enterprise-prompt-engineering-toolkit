import { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { Select, Textarea } from "../components/common/Input";
import Badge from "../components/common/Badge";
import { aiModels, promptLibrary, playgroundHistory, dummyOutput } from "../data/dummyData";

export default function Playground() {
  const [selectedPrompt, setSelectedPrompt] = useState(promptLibrary[0].title);
  const [selectedModel, setSelectedModel] = useState("gemini");
  const [input, setInput] = useState("Account #4821, churn_score 0.81, segment SMB, last login 14 days ago.");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    setOutput("");
    setTimeout(() => {
      setOutput(dummyOutput);
      setRunning(false);
    }, 1200);
  };

  const geminiModel = aiModels.filter(
  (model) => model.id === "gemini"
);
        return (
  <div className="mx-auto max-w-7xl space-y-6">
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
           🎯 Prompt Playground
          </h1>

          <p className="mt-2 text-sm text-ink-dim">
            Test, refine, and evaluate prompts using Google Gemini.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
          <p className="text-sm font-semibold text-emerald-400">
            🟢 Google Gemini
          </p>
          <p className="text-xs text-ink-faint">
            Enterprise AI Model
          </p>
        </div>
      </div>
    </div>

      <Card className="p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
      <div className="mb-5">
    <h2 className="flex items-center gap-2 text-xl font-bold text-white">
   Prompt Configuration
</h2>
<p className="mt-2 text-sm leading-6 text-gray-400">
  Choose a prompt template and confirm the AI model before generating a response.
</p>
    
  </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Select
            label="Prompt"
            value={selectedPrompt}
            onChange={(e) => setSelectedPrompt(e.target.value)}
            options={promptLibrary.map((p) => ({ value: p.title, label: p.title }))}
          />
          <div>
  <label className="mb-2 block text-sm font-medium text-ink">
    AI Model
  </label>

  <div className="rounded-xl border border-[var(--color-border-soft)] bg-black/20 px-4 py-3 text-sm text-ink">
    Google Gemini
  </div>
</div>
</div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-xl font-bold text-white">
   Prompt Input
</h2>
            <Badge tone="emerald">
  Variables
</Badge>
          </div>
        <Textarea
  rows={13}
  value={input}
  onChange={(e) => setInput(e.target.value)}
  className="rounded-2xl border border-violet-500/20 bg-slate-900/80 p-4 text-white shadow-inner focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400"
/>
          <div className="mt-6 flex justify-end">
  <Button
    icon="play"
    onClick={run}
    disabled={running}
    className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
  >
    {running ? "Running..." : " Run Prompt"}
  </Button>
</div>
        </Card>

        <Card className="p-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
           <h2 className="flex items-center gap-3 text-xl font-bold text-white">
   AI Response
</h2>
            {output && !running && <Badge tone="emerald">2.1s · 312 tokens</Badge>}
          </div>
          <div className="min-h-[280px] rounded-2xl border border-violet-500/20 bg-slate-900/80 p-5 shadow-inner">
            {running ? (
              <Loader label="🤖 Google Gemini is generating your response..." />
            ) : output ? (
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-ink-dim">{output}</pre>
            ) : (
  <div className="flex h-full flex-col items-center justify-center py-12 text-center">
    <div className="mb-4 text-5xl">🤖</div>

    <h3 className="text-lg font-semibold text-white">
      AI Response
    </h3>

    <p className="mt-2 max-w-sm text-sm text-gray-400">
      Click the <span className="font-semibold text-emerald-400">Run Prompt</span> button to generate a response from Google Gemini.
    </p>
  </div>
)}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-4">
  <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
    🕒 Recent History
  </h2>

  <p className="mt-1 text-sm text-gray-400">
    Previously executed prompts
  </p>
</div>
        <div className="mt-4 space-y-3">
          {playgroundHistory.map((h) => (
            <div
  key={h.id}
  className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-4 transition-all duration-300 hover:border-emerald-500 hover:bg-slate-800/80"
>
              <div>
               <p className="font-semibold text-white">
  {h.prompt}
</p>
                <p className="mt-1 text-xs text-emerald-400">
  🤖 {h.model}
</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-gray-300">
  {h.time}
</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
