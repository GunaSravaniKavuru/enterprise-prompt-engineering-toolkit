import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import Modal from "../components/common/Modal";
import PromptCard from "../components/prompt/PromptCard";
import { categories } from "../data/dummyData";
const sortOptions = [
  { value: "updated", label: "Recently Updated" },
  { value: "score", label: "Highest Score" },
  { value: "lowScore", label: "Lowest Score" },
  { value: "title", label: "Title A-Z" },
  { value: "oldest", label: "Oldest Updated" },
];




const getEmptyForm = () => ({
  title: "",
  category: categories.find((c) => c !== "All") || "Analytics",
  content: "",
  tags: "",
  favorite: false,
});

export default function PromptLibrary() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("updated");
  const [favOnly, setFavOnly] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(getEmptyForm);
useEffect(() => {
  const loadPrompts = async () => {
    try {
      const response = await api.get("/library/");
      setPrompts(response.data);
    } catch (error) {
  console.error(error);
  alert(JSON.stringify(error.response?.data || error.message));
}
  };

  loadPrompts();
}, []);
  
  const filtered = useMemo(() => {
    let items = prompts.filter((p) => {
      const matchesQuery =
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = category === "All" || p.category === category;
      const matchesFav = !favOnly || p.favorite;
      return matchesQuery && matchesCategory && matchesFav;
    });

    if (sort === "lowScore") {
      items.sort((a, b) => a.score - b.score);
    }

    if (sort === "title") {
      items.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === "oldest") {
      items.sort((a, b) => a.updated.localeCompare(b.updated));
    }

    return items;
  }, [query, category, sort, favOnly, prompts]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm(getEmptyForm());
  };

  const handleFieldChange = (field) => (event) => {
    const value = field === "favorite" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSavePrompt = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    const newPrompt = {
      id: `p-${Date.now()}`,
      title: form.title.trim(),
      category: form.category,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      score: 82,
      favorite: form.favorite,
      updated: "just now",
      author: "You",
      content: form.content.trim(),
    };

    setPrompts((current) => [newPrompt, ...current]);
    handleCloseModal();
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Prompt Library</h1>
          <p className="mt-1 text-sm text-ink-dim">{prompts.length} prompts across {categories.length - 1} categories</p>
        </div>
        <Button icon="plus" size="sm" onClick={handleOpenModal}>
          New Prompt
        </Button>
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
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                  category === c
                    ? "border-violet-400/40 bg-violet-500/15 text-violet-200"
                    : "border-[var(--color-border-soft)] text-ink-dim hover:text-ink hover:bg-white/5 hover:border-violet-400/30 hover:-translate-y-0.5"
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
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
          {filtered.map((p, i) => (
            <PromptCard
              key={p.id}
              prompt={p}
              index={i}
              onClick={(prompt) => navigate(`/library/${prompt.id}`, { state: { prompt } })}
            />
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Prompt"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSavePrompt}>
              Save Prompt
            </Button>
          </>
        }
      >
        <form onSubmit={handleSavePrompt} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink">Prompt Title</label>
            <input
              required
              value={form.title}
              onChange={handleFieldChange("title")}
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-white/[0.03] px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus-ring"
              placeholder="Enter a title"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink">Category</label>
            <select
              value={form.category}
              onChange={handleFieldChange("category")}
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-[#12141f] px-3 py-2.5 text-sm text-ink outline-none focus-ring"
            >
              {categories
                .filter((c) => c !== "All")
                .map((categoryOption) => (
                  <option key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink">Prompt Content</label>
            <textarea
              value={form.content}
              onChange={handleFieldChange("content")}
              rows={5}
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-white/[0.03] px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus-ring"
              placeholder="Write your prompt..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink">Tags</label>
            <input
              value={form.tags}
              onChange={handleFieldChange("tags")}
              className="w-full rounded-xl border border-[var(--color-border-soft)] bg-white/[0.03] px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus-ring"
              placeholder="comma, separated, tags"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-dim">
            <input
              type="checkbox"
              checked={form.favorite}
              onChange={handleFieldChange("favorite")}
              className="h-4 w-4 rounded border-[var(--color-border-soft)] bg-transparent text-violet-400 focus:ring-violet-400"
            />
            Favorite
          </label>
        </form>
      </Modal>
    </div>
  );
}
