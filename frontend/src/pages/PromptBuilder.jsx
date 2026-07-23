import { api } from "../services/api";
import { useState, useEffect } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Icon from "../components/common/Icon";
import { Input, Select, Textarea } from "../components/common/Input";
import { useToast } from "../components/common/Toast";
import { useNavigate, useLocation } from "react-router-dom";

const promptingTechniques = ["Standard", "Few-shot"];

const domainOptions = [
  "Engineering",
  "Marketing",
  "Education",
  "Healthcare",
  "Legal",
  "Finance",
  "Human Resources",
  "Customer Support",
  "Research",
  "General",
  "Other",
];

const promptPurposeOptions = [
  "Classification",
  "Extraction",
  "Summarization",
  "Translation",
  "JSON Generation",
  "Code Generation",
  "Other",
];

const outputFormatOptions = ["Paragraph", "Bullet Points", "Markdown", "JSON", "Table", "Code", "Custom"];

const initialState = {
  promptName: "",
  category: "Engineering",
  taskType: "Classification",
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
  customDomain: "",
  customPurpose: "",
  positiveConstraints: "",
  negativeConstraints: "",
  customOutputFormat: "",
  examples: [{ input: "", output: "" }],
};

function buildGeneratedPrompt(form) {
  const domainValue = form.category === "Other" ? form.customDomain?.trim() : form.category;
  const purposeValue = form.taskType === "Other" ? form.customPurpose?.trim() : form.taskType;
  const languageValue = form.language === "Other" ? form.customLanguage?.trim() : form.language;
  const outputFormatValue = form.outputFormat === "Custom" ? form.customOutputFormat?.trim() : form.outputFormat;

  const sections = [
    "You are an enterprise-grade AI assistant. Follow the instructions below carefully and return only the requested output.",
  ];

  if (form.promptName?.trim()) {
    sections.push(`Prompt Name: ${form.promptName.trim()}`);
  }

  if (domainValue) {
    sections.push(`Domain: ${domainValue}`);
  }

  if (purposeValue) {
    sections.push(`Prompt Purpose: ${purposeValue}`);
  }

  if (form.role?.trim()) {
    sections.push(`Role: ${form.role.trim()}`);
  }

  if (form.experienceLevel) {
    sections.push(`Experience Level: ${form.experienceLevel}`);
  }

  if (form.domain?.trim()) {
    sections.push(`Role Domain: ${form.domain.trim()}`);
  }

  if (form.communicationStyle) {
    sections.push(`Communication Style: ${form.communicationStyle}`);
  }

  if (form.context?.trim()) {
    sections.push(`Context:\n${form.context.trim()}`);
  }

  if (form.taskDescription?.trim()) {
    sections.push(`Task:\n${form.taskDescription.trim()}`);
  }

  if (form.technique === "Few-shot") {
    const exampleLines = [];
    form.examples.forEach((example, index) => {
      const input = example.input?.trim();
      const output = example.output?.trim();
      if (input || output) {
        exampleLines.push(`Example ${index + 1}:`);
        if (input) exampleLines.push(`Input: ${input}`);
        if (output) exampleLines.push(`Output: ${output}`);
      }
    });

    if (exampleLines.length > 0) {
      sections.push(`Examples:\n${exampleLines.join("\n")}`);
    }
  }

  sections.push(`Output Format: ${outputFormatValue || "Paragraph"}`);

  const ruleLines = [];
  if (form.maxWords?.trim()) {
    ruleLines.push(`Maximum Words: ${form.maxWords.trim()}`);
  }
  if (form.tone?.trim()) {
    ruleLines.push(`Tone: ${form.tone.trim()}`);
  }
  if (languageValue) {
    ruleLines.push(`Language: ${languageValue}`);
  }
  if (form.positiveConstraints?.trim()) {
    ruleLines.push(`Positive Rules: ${form.positiveConstraints.trim()}`);
  }
  if (form.negativeConstraints?.trim()) {
    ruleLines.push(`Negative Rules: ${form.negativeConstraints.trim()}`);
  }

  if (ruleLines.length > 0) {
    sections.push(`Rules:\n${ruleLines.join("\n")}`);
  }

  sections.push("Make the response polished, precise, and ready for enterprise use.");

  return sections.join("\n\n");
}

export default function PromptBuilder() {
  const [form, setForm] = useState(initialState);
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const showToast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.mode === "edit";
const editPrompt = location.state?.prompt;

useEffect(() => {
  console.log("Edit Prompt:", JSON.stringify(editPrompt, null, 2));

  if (!isEditMode || !editPrompt) return;

  if (editPrompt.form_data) {
    setForm({
      ...initialState,
      ...editPrompt.form_data,
    });

    setGeneratedPrompt(editPrompt.content || "");
  }
}, [isEditMode, editPrompt]);

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
    setGeneratedPrompt(null);
    setIsGenerating(false);
    showToast("Prompt builder cleared");
  };

  const handleGeneratePrompt = async () => {
  if (isGenerating) return;

  setIsGenerating(true);

  try {
    const response = await api.post("/builder/generate", form);

    setGeneratedPrompt(response.data.generated_prompt);
    showToast("Prompt generated successfully!");
  } catch (error) {
    console.error("Generate Prompt Error:", error);
    showToast("Failed to generate prompt.");
  } finally {
    setIsGenerating(false);
  }
};

  const savePrompt = async () => {
  if (!generatedPrompt) return;

  if (!form.promptName?.trim()) {
    showToast("Please enter a prompt name");
    return;
  }

  const payload = {
    title: form.promptName.trim(),
    category: form.category,
    tags: [],
    content: generatedPrompt,
    technique: form.technique,
    output_format: form.outputFormat,
    form_data: form,
  };

  try {
     console.log("isEditMode:", isEditMode);
     console.log("editPrompt:", editPrompt);
    if (isEditMode) {
      console.log("Updating payload:", payload);
  console.log("Updating form_data:", payload.form_data);

  // Update the prompt
  await api.put(`/library/${editPrompt.id}`, payload);

  // Create a version snapshot
  await api.post(`/versions/prompt/${editPrompt.id}`, {
    title: form.promptName.trim(),
    user_prompt: generatedPrompt,
    commit_message: "Prompt updated",
    changes: ["Prompt edited"],
    status: "Draft",
    model_used: "Gemini",
    system_prompt: "",
    variables: [],
    tags: [],
    prompt_settings: {
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 2048,
    },
    notes: "Updated from Prompt Builder",
  });

  showToast(`Prompt "${form.promptName}" updated successfully`);
} else {
  console.log("Saving payload:", payload);
  console.log("Saving form_data:", payload.form_data);
      await api.post("/library", payload);

      showToast(`Prompt "${form.promptName}" saved successfully`);
    }

    navigate("/library");
  } catch (error) {
    console.error("Save Prompt Error:", error);
    showToast("Failed to save prompt.");
  }
};
  const copyPrompt = async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      showToast("Prompt copied successfully.");
    } catch {
      showToast("Unable to copy prompt");
    }
  };

  const testInPlayground = () => {
    if (!generatedPrompt) return;

    showToast("Opening in Playground");
    navigate("/playground");
  };

  const evaluatePrompt = () => {
    if (!generatedPrompt) return;

    navigate("/evaluator", {
      state: {
        prompt: {
          title: form.promptName?.trim() || "Generated Prompt",
          category: form.category,
          content: generatedPrompt,
          score: null,
          updated: "just now",
          author: "You",
          favorite: false,
        },
      },
    });
  };

  const hasGeneratedPrompt = !!generatedPrompt;
  const statusTone = isGenerating ? "amber" : hasGeneratedPrompt ? "emerald" : "neutral";
  const statusLabel = isGenerating ? "Generating..." : hasGeneratedPrompt ? "Generated" : "Waiting for generation";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Prompt Builder</h1>
            <p className="mt-2 text-sm text-slate-400">Design professional prompts following best practices.</p>
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
                label="Domain"
                value={form.category}
                onChange={updateField("category")}
                options={domainOptions.map((option) => ({ label: option, value: option }))}
              />
              {form.category === "Other" && (
                <Input
                  label="Specify Domain"
                  value={form.customDomain}
                  onChange={updateField("customDomain")}
                  placeholder="Enter a specific domain"
                />
              )}
              <Select
                label="Prompt Purpose"
                value={form.taskType}
                onChange={updateField("taskType")}
                options={promptPurposeOptions.map((option) => ({ label: option, value: option }))}
              />
              {form.taskType === "Other" && (
                <Input
                  label="Specify Purpose"
                  value={form.customPurpose}
                  onChange={updateField("customPurpose")}
                  placeholder="Enter a specific purpose"
                />
              )}
              <Select
                label="Prompting Technique"
                value={form.technique}
                onChange={(e) => setForm((current) => ({ ...current, technique: e.target.value }))}
                options={promptingTechniques.map((t) => ({ label: t, value: t }))}
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
                        <button onClick={() => removeExample(idx)} className="text-xs text-rose-400 hover:text-rose-300">
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
            <Textarea
              label="Rules"
              rows={3}
              value={form.positiveConstraints}
              onChange={updateField("positiveConstraints")}
              placeholder="Example: Use simple language and explain step by step."
            />
          </Card>

          {/* Output Format */}
          <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Output Format</h2>
            <div className="space-y-3">
              <Select
                label="Format"
                value={form.outputFormat}
                onChange={updateField("outputFormat")}
                options={outputFormatOptions.map((f) => ({ label: f, value: f }))}
              />
              {form.outputFormat === "Custom" && (
                <div className="mt-3">
                  <Input
                    label="Describe your desired output format."
                    value={form.customOutputFormat}
                    onChange={updateField("customOutputFormat")}
                    placeholder="e.g. Executive summary with 3 bullets"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Output Constraints */}
          <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Output Constraints </h2>
            <Textarea
              label="Output Constraints "
              rows={3}
              value={form.negativeConstraints}
              onChange={updateField("negativeConstraints")}
              placeholder="Example: Maximum 100 words."
            />
          </Card>

          {/* Generate Prompt */}
          <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Generate</h2>
                <p className="mt-1 text-xs text-slate-500">Generate the prompt only when you are ready.</p>
              </div>
              <Button
                className="w-full sm:w-auto sm:min-w-[220px]"
                size="lg"
                onClick={handleGeneratePrompt}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating...
                  </span>
                ) : (
                  "✨ Generate Prompt"
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Sticky Generated Prompt */}
        <div className="h-fit xl:sticky xl:top-6">
          <Card className="border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Generated Prompt</h2>
              <Badge tone={statusTone}>{statusLabel}</Badge>
            </div>

            {!isGenerating && !generatedPrompt && (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-10 text-center">
                <div className="max-w-sm space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                    <Icon name="file" size={22} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">No Prompt Generated</h3>
                    <p className="text-sm leading-6 text-slate-400">
                      Complete the required fields and click 'Generate Prompt' to create your prompt.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge tone="cyan">AI Generated</Badge>
                    <Badge tone="emerald">Ready to Save</Badge>
                    <Badge tone="violet">Test in Playground</Badge>
                  </div>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center">
                <div className="max-w-sm space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">AI is generating your prompt...</h3>
                    <p className="text-sm text-slate-400">Please wait...</p>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              </div>
            )}

            {!isGenerating && generatedPrompt && (
              <div className="space-y-4">
                <div className="max-h-[50vh] overflow-y-auto rounded-2xl border border-cyan-500/10 bg-black/40 p-4 shadow-inner shadow-black/20">
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-200">{generatedPrompt}</pre>
                </div>

                <div className="mt-4 flex w-full flex-wrap items-center gap-2 lg:flex-nowrap lg:gap-2.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="copy"
                    onClick={copyPrompt}
                    disabled={!hasGeneratedPrompt}
                    className="h-9 w-9 shrink-0 px-0"
                    title="Copy prompt"
                    aria-label="Copy prompt"
                  />
                  <Button
  size="sm"
  icon="check"
  onClick={savePrompt}
  disabled={!hasGeneratedPrompt}
  className="h-9 min-w-0 flex-1 basis-0 whitespace-nowrap px-3 text-[11px] sm:text-xs"
>
  {isEditMode ? "Update Prompt" : "Save Prompt"}
</Button>
                  <Button size="sm" icon="gauge" onClick={evaluatePrompt} disabled={!hasGeneratedPrompt} className="h-9 min-w-0 flex-1 basis-0 whitespace-nowrap px-3 text-[11px] sm:text-xs">
                    Evaluate
                  </Button>
                  <Button size="sm" icon="play" onClick={testInPlayground} disabled={!hasGeneratedPrompt} className="h-9 min-w-0 flex-1 basis-0 whitespace-nowrap px-2.5 text-[11px] sm:px-3 sm:text-xs">
                    Test in Playground
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="x"
                    onClick={resetPrompt}
                    className="h-9 w-9 shrink-0 px-0"
                    title="Clear prompt"
                    aria-label="Clear prompt"
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
