import { motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Icon from "../components/common/Icon";
import { promptLibrary } from "../data/dummyData";

const STORAGE_KEY = "prompt-library-prompts";

const getStoredPrompts = () => {
  if (typeof window === "undefined") return promptLibrary;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return promptLibrary;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : promptLibrary;
  } catch {
    return promptLibrary;
  }
};

const categoryTone = {
  Analytics: "cyan",
  Marketing: "amber",
  Engineering: "violet",
  Legal: "rose",
  Support: "emerald",
  Finance: "lime",
  Healthcare: "red",
  "Human Resources": "blue",
};

export default function PromptDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { promptId } = useParams();

  const prompt = location.state?.prompt || getStoredPrompts().find((item) => item.id === promptId);

  if (!prompt) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex w-full max-w-3xl items-center justify-center"
      >
        <Card className="w-full p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
            <Icon name="book" size={24} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Prompt Not Found</h1>
          <p className="mt-2 text-sm text-ink-dim">This prompt could not be located. Try going back to the library and selecting another card.</p>
          <div className="mt-6 flex justify-center">
            <Button icon="chevronLeft" size="sm" variant="secondary" onClick={() => navigate("/library")}>
              Back to Prompt Library
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="mx-auto w-full max-w-4xl space-y-5"
    >
      <div className="flex items-center justify-between gap-3">
        <Button variant="secondary" size="sm" icon="chevronLeft" onClick={() => navigate(-1)}>
          Back to Library
        </Button>
        <Button size="sm" icon="sparkle" onClick={() => navigate("/evaluator", { state: { prompt } })}>
          Evaluate Prompt
        </Button>
      </div>

      <Card className="p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge tone={categoryTone[prompt.category] || "neutral"}>{prompt.category}</Badge>
            <h1 className="mt-3 font-display text-2xl font-semibold text-ink">{prompt.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-dim">
              <span>Author: {prompt.author || "Unknown"}</span>
              <span>•</span>
              <span>Updated {prompt.updated || "just now"}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white/[0.03] px-4 py-3 text-center">
            <div className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">Quality Score</div>
            <div className="mt-1 text-2xl font-semibold text-ink">{prompt.score}</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {(prompt.tags || []).map((tag) => (
            <Badge key={tag} tone="neutral">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-[var(--color-border-soft)] bg-white/[0.03] px-3 py-2 text-sm text-ink-dim">
          <Icon name="star" size={15} className={prompt.favorite ? "text-amber-300" : "text-ink-faint"} />
          <span>{prompt.favorite ? "Favorite prompt" : "Not marked as favorite"}</span>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">Full Prompt Content</div>
          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[#111421]/80 p-4 text-sm leading-7 text-ink">
            {prompt.content || "No content available for this prompt yet."}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
