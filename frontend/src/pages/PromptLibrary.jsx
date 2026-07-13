import { useMemo, useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import PromptCard from "../components/prompt/PromptCard";
import { promptLibrary, categories } from "../data/dummyData";

const sortOptions = [
  { value: "updated", label: "Recently Updated" },
  { value: "score", label: "Highest Score" },
  { value: "title", label: "Title A–Z" },
];

export default function PromptLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("updated");
  const [favOnly, setFavOnly] = useState(false);

  const filtered = useMemo(() => {
    let items = promptLibrary.filter((p) => {
      const matchesQuery =
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = category === "All" || p.category === category;
      const matchesFav = !favOnly || p.favorite;
      return matchesQuery && matchesCategory && matchesFav;
    });
    if (sort === "score") items = [...items].sort((a, b) => b.score - a.score);
    if (sort === "title") items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    return items;
  }, [query, category, sort, favOnly]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Prompt Library</h1>
          <p className="mt-1 text-sm text-ink-dim">{promptLibrary.length} prompts across {categories.length - 1} categories</p>
        </div>
        <Button icon="plus" size="sm">New Prompt</Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--color-border-soft)] bg-white/[0.03] px-3.5 py-2.5">
            <Icon name="search" size={16} className="text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or tag…"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  category === c
                    ? "border-violet-400/40 bg-violet-500/15 text-violet-200"
                    : "border-[var(--color-border-soft)] text-ink-dim hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={() => setFavOnly((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${
              favOnly ? "bg-amber-500/15 text-amber-300" : "text-ink-dim hover:bg-white/5"
            }`}
          >
            <Icon name="star" size={13} /> Favorites only
          </button>
          <div className="ml-auto flex items-center gap-2 text-ink-dim">
            <Icon name="filter" size={13} />
            <span>Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-[var(--color-border-soft)] bg-[#12141f] px-2 py-1 text-ink focus-ring outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-ink-dim">No prompts match your filters. Try a different search or category.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <PromptCard key={p.id} prompt={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
