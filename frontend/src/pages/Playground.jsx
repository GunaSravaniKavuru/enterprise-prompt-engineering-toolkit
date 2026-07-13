import { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { Select, Textarea } from "../components/common/Input";
import Badge from "../components/common/Badge";
import { aiModels, promptLibrary, playgroundHistory, dummyOutput } from "../data/dummyData";

export default function Playground() {
  const [selectedPrompt, setSelectedPrompt] = useState(promptLibrary[0].title);
  const [selectedModel, setSelectedModel] = useState(aiModels[1].id);
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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Playground</h1>
        <p className="mt-1 text-sm text-ink-dim">Run a prompt against a model and inspect the response. No backend connected yet.</p>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Prompt"
            value={selectedPrompt}
            onChange={(e) => setSelectedPrompt(e.target.value)}
            options={promptLibrary.map((p) => ({ value: p.title, label: p.title }))}
          />
          <Select
            label="AI Model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            options={aiModels.map((m) => ({ value: m.id, label: `${m.name} · ${m.provider}` }))}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-ink">Input</h2>
            <Badge tone="neutral">Variables</Badge>
          </div>
          <Textarea rows={10} value={input} onChange={(e) => setInput(e.target.value)} />
          <div className="mt-4 flex justify-end">
            <Button icon="play" onClick={run} disabled={running}>
              {running ? "Running…" : "Run Prompt"}
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-ink">Output</h2>
            {output && !running && <Badge tone="emerald">2.1s · 312 tokens</Badge>}
          </div>
          <div className="min-h-[200px] rounded-xl bg-black/30 p-4">
            {running ? (
              <Loader label="Waiting on model response…" />
            ) : output ? (
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-ink-dim">{output}</pre>
            ) : (
              <p className="text-sm text-ink-faint">Run the prompt to see a simulated model response here.</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-display text-sm font-semibold text-ink">History</h2>
        <div className="mt-3 divide-y divide-[var(--color-border-soft)]">
          {playgroundHistory.map((h) => (
            <div key={h.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="text-ink">{h.prompt}</p>
                <p className="mt-0.5 text-xs text-ink-faint">{h.model}</p>
              </div>
              <span className="text-xs text-ink-faint">{h.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
