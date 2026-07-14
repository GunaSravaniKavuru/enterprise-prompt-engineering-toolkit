import { useMemo, useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import { Input, Select, Textarea } from "../components/common/Input";
import { useToast } from "../components/common/Toast";
import { useNavigate } from "react-router-dom";

const promptingTechniques = [
  "Standard",
  "Few-shot",
];

const categoryOptions = [
  "Classification",
  "Extraction",
  "Summarization",
  "Translation",
  "JSON Generation",
  "Code Generation",
  "Other",
];

const outputFormatOptions = [
  "Paragraph",
  "Bullet Points",
  "Markdown",
  "JSON",
  "Table",
  "Code",
  "Custom",
];

const initialState = {
  promptName: "",
  category: "Classification",
  customCategory: "",
  technique: "Standard",
  role: "",
  experienceLevel: "Mid-level",
  domain: "",
  communicationStyle: "Professional",
  context: "",
  taskDescription: "",
  outputFormat: "Paragraph",
  maxWords: "",
  tone: "Professional",
  language: "English",
  customLanguage: "",
  positiveConstraints: "",
  negativeConstraints: "",
  customOutputFormat: "",
  examples: [{ input: "", output: "" }],
};

export default function PromptBuilder() {
  const [form, setForm] = useState(initialState);
  const showToast = useToast();
  const navigate = useNavigate();

  const completenessChecklist = useMemo(() => {
    return {
      role: !!form.role?.trim(),
      context: !!form.context?.trim(),
      task: !!form.taskDescription?.trim(),
      outputFormat: !!form.outputFormat?.trim(),
      constraints:
        !!form.positiveConstraints?.trim() || !!form.negativeConstraints?.trim() || !!form.maxWords?.trim(),
    };
  }, [form.role, form.context, form.taskDescription, form.outputFormat, form.positiveConstraints, form.negativeConstraints, form.maxWords]);

  const isComplete = Object.values(completenessChecklist).every((v) => v);

  const preview = useMemo(() => {
    const sections = [];

    // Role section
    if (form.role?.trim()) {
      sections.push(`You are a ${form.role}.`);
      if (form.experienceLevel) sections.push(`Experience Level: ${form.experienceLevel}`);
      if (form.domain?.trim()) sections.push(`Domain: ${form.domain}`);
      if (form.communicationStyle) sections.push(`Communication Style: ${form.communicationStyle}`);
    }

    // Context
    if (form.context?.trim()) {
      sections.push(`Context:\n${form.context}`);
    }

    // Task
    if (form.taskDescription?.trim()) {
      let taskSection = "Task:";
      taskSection += `\n- Description: ${form.taskDescription}`;
      sections.push(taskSection);
    }

    // Technique-specific content
    if (form.technique === "Few-shot" && form.examples?.some((ex) => ex.input?.trim() || ex.output?.trim())) {
      let examplesSection = "Examples:";
      form.examples.forEach((ex, idx) => {
        if (ex.input?.trim() || ex.output?.trim()) {
          examplesSection += `\n\nExample ${idx + 1}:`;
          if (ex.input?.trim()) examplesSection += `\nInput: ${ex.input}`;
          if (ex.output?.trim()) examplesSection += `\nOutput: ${ex.output}`;
        }
      });
      sections.push(examplesSection);
    }

    // Output Format
    let outputFormatText = form.outputFormat;
    if (form.outputFormat === "Custom" && form.customOutputFormat?.trim()) {
      outputFormatText = form.customOutputFormat;
    }
    sections.push(`Output Format: ${outputFormatText}`);

    // Constraints
    let constraintsSection = [];
    if (form.maxWords?.trim()) constraintsSection.push(`Max Words: ${form.maxWords}`);
    if (form.tone) constraintsSection.push(`Tone: ${form.tone}`);
    
    let languageText = form.language;
    if (form.language === "Other" && form.customLanguage?.trim()) {
      languageText = form.customLanguage;
    }
    if (languageText) constraintsSection.push(`Language: ${languageText}`);
    
    if (form.positiveConstraints?.trim()) constraintsSection.push(`Do: ${form.positiveConstraints}`);
    if (form.negativeConstraints?.trim()) constraintsSection.push(`Don't: ${form.negativeConstraints}`);

    if (constraintsSection.length > 0) {
      sections.push(`Constraints:\n${constraintsSection.join("\n")}`);
    }

    return sections.join("\n\n") || "Fill in the fields to generate a polished prompt.";
  }, [form]);

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const addExample = () => {
    setForm((current) => ({
      ...current,
      examples: [...current.examples, { input: "", output: "" }],
    }));
  };

  const removeExample = (index) => {
    setForm((current) => ({
      ...current,
      examples: current.examples.filter((_, i) => i !== index),
    }));
  };

  const updateExample = (index, field, value) => {
    setForm((current) => {
      const updated = [...current.examples];
      updated[index] = { ...updated[index], [field]: value };
      return { ...current, examples: updated };
    });
  };

  const resetPrompt = () => {
    setForm(initialState);
    showToast("Prompt builder cleared");
  };

  const generatePrompt = () => {
    showToast("Prompt generated successfully");
  };

  const savePrompt = () => {
    if (!form.promptName?.trim()) {
      showToast("Please enter a prompt name");
      return;
    }
    showToast(`Prompt "${form.promptName}" saved to library`);
  };

  const testInPlayground = () => {
    showToast("Opening in Playground");
    navigate("/playground");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Prompt Builder</h1>
            <p className="mt-2 text-sm text-slate-400">Design professional prompts following best practices.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" icon="x" onClick={resetPrompt}>
              Clear
            </Button>
            <Button variant="secondary" size="sm" icon="check" onClick={savePrompt}>
              Save Prompt
            </Button>
            <Button size="sm" icon="play" onClick={testInPlayground}>
              Test in Playground
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Left Column - Form */}
        <div className="space-y-5">
          {/* Basic Information */}
          <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Basic Information</h2>
            <div className="space-y-3">
              <Input label="Prompt Name" value={form.promptName} onChange={updateField("promptName")} placeholder="e.g. Email Summarizer" />
              <Select
                label="Category"
                value={form.category}
                onChange={updateField("category")}
                options={categoryOptions.map((option) => ({ label: option, value: option }))}
              />
              {form.category === "Other" && (
                <Input
                  label="Custom Category"
                  type="search"
                  value={form.customCategory}
                  onChange={updateField("customCategory")}
                  placeholder="Type a custom category"
                />
              )}
              <Select
                label="Prompting Technique"
                value={form.technique}
                onChange={(e) => setForm((current) => ({ ...current, technique: e.target.value }))}
                options={promptingTechniques.map((t) => ({ label: t, value: t }))}
              />
            </div>
          </Card>

          {/* Role (Persona) */}
          <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Role (Persona)</h2>
            <div className="space-y-3">
              <Input label="Role" value={form.role} onChange={updateField("role")} placeholder="e.g. Senior Software Engineer" />
              <Select
                label="Experience Level"
                value={form.experienceLevel}
                onChange={updateField("experienceLevel")}
                options={[
                  { label: "Junior", value: "Junior" },
                  { label: "Mid-level", value: "Mid-level" },
                  { label: "Senior", value: "Senior" },
                  { label: "Lead", value: "Lead" },
                  { label: "Expert", value: "Expert" },
                ]}
              />
              <Input label="Domain" value={form.domain} onChange={updateField("domain")} placeholder="e.g. Healthcare, Finance" />
              <Select
                label="Communication Style"
                value={form.communicationStyle}
                onChange={updateField("communicationStyle")}
                options={[
                  { label: "Professional", value: "Professional" },
                  { label: "Casual", value: "Casual" },
                  { label: "Formal", value: "Formal" },
                  { label: "Friendly", value: "Friendly" },
                  { label: "Technical", value: "Technical" },
                ]}
              />
            </div>
          </Card>

          {/* Context */}
          <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Context</h2>
            <Textarea
              label=""
              rows={4}
              value={form.context}
              onChange={updateField("context")}
              placeholder="Describe the background, audience, or situation..."
            />
            <p className="mt-2 text-xs text-slate-500">
              <span className="font-medium">Example:</span> We are a SaaS company with 500 customers in the healthcare sector.
            </p>
          </Card>

          {/* Task */}
          <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Task</h2>
            <Textarea
              label="Task Description *"
              rows={4}
              value={form.taskDescription}
              onChange={updateField("taskDescription")}
              placeholder="Describe exactly what the model should do..."
            />
          </Card>

          {/* Technique-Specific Sections */}
          {form.technique === "Few-shot" && (
            <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Examples</h2>
              <div className="space-y-4">
                {form.examples.map((example, idx) => (
                  <div key={idx} className="space-y-2 rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-300">Example {idx + 1}</p>
                      {form.examples.length > 1 && (
                        <button
                          onClick={() => removeExample(idx)}
                          className="text-xs text-rose-400 hover:text-rose-300"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <Input
                      label="Input"
                      value={example.input}
                      onChange={(e) => updateExample(idx, "input", e.target.value)}
                      placeholder="Input example..."
                    />
                    <Input
                      label="Output"
                      value={example.output}
                      onChange={(e) => updateExample(idx, "output", e.target.value)}
                      placeholder="Expected output..."
                    />
                  </div>
                ))}
                <Button variant="secondary" size="sm" icon="plus" onClick={addExample}>
                  Add Example
                </Button>
              </div>
            </Card>
          )}

          {/* Rules */}
          <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Rules</h2>
            <div className="space-y-3">
              <Textarea
                label="Positive Rules (Do...)"
                rows={2}
                value={form.positiveConstraints}
                onChange={updateField("positiveConstraints")}
                placeholder="e.g. Use simple language, include examples"
              />
              <Textarea
                label="Negative Rules (Don't...)"
                rows={2}
                value={form.negativeConstraints}
                onChange={updateField("negativeConstraints")}
                placeholder="e.g. Avoid jargon, don't include personal opinions"
              />
            </div>
          </Card>

          {/* Output Format */}
          <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Output Format</h2>
            <Select
              label="Format"
              value={form.outputFormat}
              onChange={updateField("outputFormat")}
              options={outputFormatOptions.map((f) => ({ label: f, value: f }))}
            />
            {form.outputFormat === "Custom" && (
              <div className="mt-3">
                <Input
                  label="Custom Format"
                  value={form.customOutputFormat}
                  onChange={updateField("customOutputFormat")}
                  placeholder="e.g. Executive summary with 3 bullets"
                />
              </div>
            )}
          </Card>

          {/* Output Constraints */}
          <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Output Constraints</h2>
            <div className="space-y-3">
              <Input label="Maximum Words" value={form.maxWords} onChange={updateField("maxWords")} placeholder="e.g. 300" />
              <Select
                label="Tone"
                value={form.tone}
                onChange={updateField("tone")}
                options={[
                  { label: "Professional", value: "Professional" },
                  { label: "Casual", value: "Casual" },
                  { label: "Formal", value: "Formal" },
                  { label: "Friendly", value: "Friendly" },
                  { label: "Technical", value: "Technical" },
                ]}
              />
              <Select
                label="Language"
                value={form.language}
                onChange={updateField("language")}
                options={[
                  { label: "English", value: "English" },
                  { label: "Other", value: "Other" },
                ]}
              />
              {form.language === "Other" && (
                <>
                  <Input
                    label="Specify Language"
                    type="search"
                    list="prompt-builder-languages"
                    value={form.customLanguage}
                    onChange={updateField("customLanguage")}
                    placeholder="Type any language"
                  />
                  <datalist id="prompt-builder-languages">
                    <option value="Spanish" />
                    <option value="French" />
                    <option value="German" />
                    <option value="Hindi" />
                    <option value="Japanese" />
                    <option value="Chinese" />
                  </datalist>
                </>
              )}
            </div>
          </Card>

          {/* Technique-Specific Sections */}

        </div>

        {/* Right Column - Sticky Preview */}
        <div className="h-fit xl:sticky xl:top-6">
          <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Live Preview</h2>
              <Badge tone={isComplete ? "emerald" : "amber"}>
                {isComplete ? "Complete" : "Incomplete"}
              </Badge>
            </div>

            {/* Completeness Checklist */}
            <div className="mb-4 space-y-2 rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Completeness</p>
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className={completenessChecklist.role ? "text-emerald-400" : "text-slate-500"}>
                    {completenessChecklist.role ? "✓" : "○"} Role
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={completenessChecklist.context ? "text-emerald-400" : "text-slate-500"}>
                    {completenessChecklist.context ? "✓" : "○"} Context
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={completenessChecklist.task ? "text-emerald-400" : "text-slate-500"}>
                    {completenessChecklist.task ? "✓" : "○"} Task
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={completenessChecklist.outputFormat ? "text-emerald-400" : "text-slate-500"}>
                    {completenessChecklist.outputFormat ? "✓" : "○"} Output Format
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={completenessChecklist.constraints ? "text-emerald-400" : "text-slate-500"}>
                    {completenessChecklist.constraints ? "✓" : "○"} Constraints
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Text */}
            <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-4">
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">
                {preview}
              </pre>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
