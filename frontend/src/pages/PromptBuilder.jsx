import { useMemo, useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import { Input, Select, Textarea } from "../components/common/Input";
import { useToast } from "../components/common/Toast";
import { useNavigate } from "react-router-dom";

const initialState = {
  role: "Software Engineer",
  context: "",
  task: "",
  outputFormat: "Paragraph",
  constraints: "",
};

const roleOptions = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Prompt Engineer",
  "UI/UX Designer",
  "Data Scientist",
  "Teacher",
  "Doctor",
  "Content Writer",
  "Marketing Specialist",
  "Other",
];

const outputFormatOptions = [
  "Paragraph",
  "Bullet Points",
  "Table",
  "JSON",
  "Markdown",
  "Code",
  "Report",
  "Step-by-step",
  "Custom",
];

export default function PromptBuilder() {
  const [form, setForm] = useState(initialState);
  const [roleOption, setRoleOption] = useState(initialState.role);
  const [customRole, setCustomRole] = useState("");
  const [outputFormatOption, setOutputFormatOption] = useState(initialState.outputFormat);
  const [customOutputFormat, setCustomOutputFormat] = useState("");
  const showToast = useToast();
  const navigate = useNavigate();

  const preview = useMemo(() => {
    const sections = [];
    const roleText = form.role?.trim() || "a helpful assistant";
    const taskText = form.task?.trim() || "complete the requested task";
    const contextText = form.context?.trim();
    const constraintsText = form.constraints?.trim();
    const outputText = form.outputFormat?.trim() || "a clear response";

    sections.push(`You are ${roleText}.`);
    sections.push(`Your task is to ${taskText}.`);

    if (contextText) {
      sections.push(`Context:\n${contextText}`);
    }

    if (constraintsText) {
      sections.push(`Constraints:\n${constraintsText}`);
    }

    sections.push(`Output Format:\n${outputText}`);

    return sections.join("\n\n");
  }, [form.context, form.constraints, form.outputFormat, form.role, form.task]);

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleRoleChange = (value) => {
    setRoleOption(value);

    if (value === "Other") {
      setForm((current) => ({ ...current, role: customRole.trim() }));
      return;
    }

    setCustomRole("");
    setForm((current) => ({ ...current, role: value }));
  };

  const handleCustomRole = (value) => {
    setCustomRole(value);
    setForm((current) => ({ ...current, role: value }));
  };

  const handleOutputFormatChange = (value) => {
    setOutputFormatOption(value);

    if (value === "Custom") {
      setForm((current) => ({ ...current, outputFormat: customOutputFormat.trim() }));
      return;
    }

    setCustomOutputFormat("");
    setForm((current) => ({ ...current, outputFormat: value }));
  };

  const handleCustomOutputFormat = (value) => {
    setCustomOutputFormat(value);
    setForm((current) => ({ ...current, outputFormat: value }));
  };

  const applySuggestions = () => {
    setForm((current) => ({
      ...current,
      role: current.role || "Software Engineer",
      context: current.context || "This task is for a business or personal project that needs a practical answer.",
      task: current.task || "Provide a clear and helpful response.",
      outputFormat: current.outputFormat || "Paragraph",
      constraints: current.constraints || "Keep the answer concise and easy to understand.",
    }));
    setRoleOption("Software Engineer");
    setCustomRole("");
    setOutputFormatOption("Paragraph");
    setCustomOutputFormat("");
    showToast("Starter guidance applied");
  };

  const resetPrompt = () => {
    setForm(initialState);
    setRoleOption(initialState.role);
    setCustomRole("");
    setOutputFormatOption(initialState.outputFormat);
    setCustomOutputFormat("");
    showToast("Prompt builder cleared");
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Prompt Builder</h1>
          <p className="mt-1 text-sm text-ink-dim">Create a polished prompt in a few simple steps.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" icon="sparkle" onClick={applySuggestions}>
            AI Suggest
          </Button>
          <Button variant="secondary" size="sm" icon="x" onClick={resetPrompt}>
            Clear
          </Button>
          <Button variant="secondary" size="sm" icon="check" onClick={() => showToast("Prompt saved to library")}>
            Save Prompt
          </Button>
          <Button
            size="sm"
            icon="play"
            onClick={() => {
              showToast("Opening in Playground");
              navigate("/playground");
            }}
          >
            Test in Playground
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <div className="space-y-5">
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-ink-faint">1. Role</p>
              <div className="mt-3">
                <Select
                  label="Choose a role"
                  value={roleOption}
                  onChange={(event) => handleRoleChange(event.target.value)}
                  options={roleOptions.map((option) => ({ label: option, value: option }))}
                />
              </div>
              {roleOption === "Other" && (
                <div className="mt-3">
                  <Input
                    label="Write your own role"
                    value={customRole}
                    onChange={(event) => handleCustomRole(event.target.value)}
                    placeholder="e.g. Customer Success Manager"
                  />
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-ink-faint">2. Context</p>
              <div className="mt-3">
                <Textarea
                  label="Describe the situation or background"
                  rows={5}
                  value={form.context}
                  onChange={updateField("context")}
                  placeholder="Describe the situation or background."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-ink-faint">3. Task</p>
              <div className="mt-3">
                <Textarea
                  label="Describe exactly what you want the AI to do"
                  rows={5}
                  value={form.task}
                  onChange={updateField("task")}
                  placeholder="Describe exactly what you want the AI to do."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-ink-faint">4. Output Format</p>
              <div className="mt-3">
                <Select
                  label="Choose a format"
                  value={outputFormatOption}
                  onChange={(event) => handleOutputFormatChange(event.target.value)}
                  options={outputFormatOptions.map((option) => ({ label: option, value: option }))}
                />
              </div>
              {outputFormatOption === "Custom" && (
                <div className="mt-3">
                  <Input
                    label="Write your own format"
                    value={customOutputFormat}
                    onChange={(event) => handleCustomOutputFormat(event.target.value)}
                    placeholder="e.g. Executive summary with 3 bullets"
                  />
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-ink-faint">5. Constraints (Optional)</p>
              <div className="mt-3">
                <Textarea
                  label="Add any extra instructions"
                  rows={4}
                  value={form.constraints}
                  onChange={updateField("constraints")}
                  placeholder="Example: Keep the answer under 300 words. Use simple English."
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-ink">Live Prompt Preview</h2>
            <Badge tone="violet">Auto-updating</Badge>
          </div>
          <div className="max-h-[40rem] overflow-y-auto rounded-xl border border-[var(--color-border-soft)] bg-black/30 p-4">
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-ink-dim">
              {preview || "Fill in the fields to generate a polished prompt."}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
