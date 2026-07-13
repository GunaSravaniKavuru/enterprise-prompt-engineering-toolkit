import { motion } from "framer-motion";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Icon from "../common/Icon";
import QualityRing from "../common/QualityRing";
import { useToast } from "../common/Toast";

const categoryTone = {
  Analytics: "cyan",
  Marketing: "amber",
  Engineering: "violet",
  Legal: "rose",
  Support: "emerald",
};

export default function PromptCard({ prompt, index = 0, compact = false }) {
  const showToast = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Card className="group flex h-full flex-col p-5 transition-colors hover:border-[var(--color-border-hi)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge tone={categoryTone[prompt.category] || "neutral"}>{prompt.category}</Badge>
            <h3 className="mt-2.5 truncate font-display text-sm font-semibold text-ink">{prompt.title}</h3>
            <p className="mt-1 text-xs text-ink-faint">Updated {prompt.updated}</p>
          </div>
          {!compact && <QualityRing score={prompt.score} size={56} stroke={5} />}
        </div>

        {prompt.tags && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {prompt.tags.map((t) => (
              <Badge key={t} tone="neutral">
                #{t}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-1 pt-4 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => showToast(`Marked "${prompt.title}" as favorite`)}
            className="rounded-lg p-2 text-ink-faint hover:bg-white/5 hover:text-amber-300 focus-ring"
            title="Favorite"
          >
            <Icon name="star" size={15} />
          </button>
          <button
            onClick={() => showToast(`Duplicated "${prompt.title}"`)}
            className="rounded-lg p-2 text-ink-faint hover:bg-white/5 hover:text-ink focus-ring"
            title="Duplicate"
          >
            <Icon name="copy" size={15} />
          </button>
          <button
            onClick={() => showToast(`Opened editor for "${prompt.title}"`)}
            className="rounded-lg p-2 text-ink-faint hover:bg-white/5 hover:text-ink focus-ring"
            title="Edit"
          >
            <Icon name="edit" size={15} />
          </button>
          <button
            onClick={() => showToast(`Preview: "${prompt.title}"`)}
            className="rounded-lg p-2 text-ink-faint hover:bg-white/5 hover:text-ink focus-ring"
            title="Preview"
          >
            <Icon name="eye" size={15} />
          </button>
          <button
            onClick={() => showToast(`Deleted "${prompt.title}"`, "rose")}
            className="ml-auto rounded-lg p-2 text-ink-faint hover:bg-rose-500/10 hover:text-rose-300 focus-ring"
            title="Delete"
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
