import { api } from "../services/api";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Icon from "../components/common/Icon";

import heroAi from "../assets/hero-ai.svg.svg";

const quickActions = [
  { label: "New Prompt", icon: "plus", to: "/builder" },
  { label: "Prompt Library", icon: "book", to: "/library" },
  { label: "Playground", icon: "play", to: "/playground" },
];



const activityMeta = {
  optimized: { icon: "sparkle", tone: "violet" },
  created: { icon: "plus", tone: "cyan" },
  flagged: { icon: "check", tone: "amber" },
  compared: { icon: "columns", tone: "emerald" },
  restored: { icon: "restore", tone: "rose" },
};

function getPromptStatus(score) {
  if (score >= 90) return { label: "Optimized", tone: "emerald" };
  if (score >= 75) return { label: "Evaluated", tone: "violet" };
  return { label: "Needs Review", tone: "amber" };
}

function HeroIllustration() {
  return (
    <div className="flex items-center justify-center p-2">
      <img
        src={heroAi}
        alt="Hero illustration"
        className="w-[400px] max-w-[420px] h-auto object-contain"
        style={{ width: "min(42vw, 420px)" }}
      />
    </div>
  );
}

export default function Dashboard() {
  const userName = localStorage.getItem("userName") || "Guest";
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalPrompts: 0,
    averageQuality: 0,
    evaluated: 0,
    optimized: 0,
  });
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const promptRes = await api.get("/library/");

      const prompts = promptRes.data;

      setRecentPrompts(prompts.slice(0, 4));

      setStats({
        totalPrompts: prompts.length,
        averageQuality:
          prompts.length > 0
            ? (
                prompts.reduce((sum, p) => sum + (p.score || 0), 0) /
                prompts.length
              ).toFixed(1)
            : 0,
        evaluated: prompts.filter((p) => p.score != null).length,
        optimized: prompts.filter((p) => p.category === "Optimizer").length,
      });

      setRecentActivity(
        prompts.slice(0, 5).map((p) => ({
          id: p.id,
          actor: "You",
          action: "updated",
          target: p.title,
          time: new Date(p.updated_at).toLocaleString(),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };
  const overviewCards = [
  {
    label: "Total Prompts",
    value: stats.totalPrompts,
    description: "All prompts in your workspace",
    icon: "plus",
  },
  {
    label: "Average Prompt Quality",
    value: stats.averageQuality,
    description: "Across all prompts",
    icon: "sparkle",
  },
  {
    label: "Prompts Evaluated",
    value: stats.evaluated,
    description: "Successfully evaluated prompts",
    icon: "check",
  },
  {
    label: "Prompt Optimizations",
    value: stats.optimized,
    description: "Optimized prompts",
    icon: "sparkle",
  },
];
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-8 sm:px-6 lg:px-8">
      <section>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card className="relative overflow-hidden border border-white/10 bg-slate-950/75 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.9)] sm:p-8">
            <div className="absolute -right-16 -top-14 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute -left-20 -bottom-16 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-center">
              <div className="space-y-6">
                <Badge tone="cyan">Welcome, {userName}!</Badge>
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Welcome back</p>
                  <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Enterprise Prompt Engineering Toolkit
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 sm:text-base" style={{ color: "#B8C1D9" }}>
                    Manage, build, optimize, evaluate, and refine AI prompts across your team from a unified workspace.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {quickActions.map((action) => (
                    <Link key={action.label} to={action.to}>
                      <Button variant={action.label === "New Prompt" ? "primary" : "secondary"} size="sm" icon={action.icon}>
                        {action.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.9)] sm:p-6">
                <HeroIllustration />
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Workspace Overview</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">A quick summary of your prompt workspace essentials.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <Card className="h-full min-h-[170px] border border-white/10 bg-slate-950/60 p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.8)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/5 text-violet-300 shadow-sm shadow-black/10">
                  <Icon name={card.icon} size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-400">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{card.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Recent Prompts</h2>
              <p className="mt-1 text-sm text-slate-400">Recently created or updated prompts ready to review.</p>
            </div>
            {/* Removed "View all" link per design; library button in hero is primary access */}
          </div>
          <Card className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/60 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.95)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Prompt Name</th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Category</th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Updated</th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Quality</th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Status</th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {recentPrompts.slice(0, 4).map((prompt) => {
                    const status = getPromptStatus(prompt.score);
                    return (
                      <tr key={prompt.id} className="transition-colors hover:bg-white/5">
                        <td className="px-5 py-4 align-top text-sm text-white">{prompt.title}</td>
                        <td className="px-5 py-4 align-top text-sm">
                          <Badge tone={prompt.category === "Engineering" ? "violet" : prompt.category === "Marketing" ? "amber" : prompt.category === "Legal" ? "rose" : prompt.category === "Support" ? "emerald" : "cyan"}>
                            {prompt.category}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 align-top text-sm text-slate-400">{prompt.updated}</td>
                        <td className="px-5 py-4 align-top text-sm text-white">{prompt.score}</td>
                        <td className="px-5 py-4 align-top">
                          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${status.tone === "emerald" ? "bg-emerald-500/10 text-emerald-300" : status.tone === "violet" ? "bg-violet-500/10 text-violet-300" : "bg-amber-500/10 text-amber-300"}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 align-top">
                          <div className="flex items-center gap-2">
                            <button className="text-sm px-3 py-1 rounded-md bg-white/5 text-slate-300 hover:bg-white/10">View</button>
                            <button className="text-sm px-3 py-1 rounded-md border border-white/10 text-slate-300 hover:bg-white/10">Edit</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <Card className="h-full border border-white/10 bg-slate-950/60 p-5 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.95)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
              <p className="mt-1 text-sm text-slate-400">A timeline of actions in your workspace.</p>
            </div>
            <Badge tone="neutral">Live</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {recentActivity.map((activity, index) => {
              const meta = activityMeta[activity.action] || activityMeta.optimized;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-3"
                >
                  <span className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${meta.tone === "violet" ? "bg-violet-500/10 text-violet-300" : meta.tone === "cyan" ? "bg-cyan-500/10 text-cyan-300" : meta.tone === "amber" ? "bg-amber-500/10 text-amber-300" : meta.tone === "emerald" ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>
                    <Icon name={meta.icon} size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-medium text-white">{activity.actor}</span> {activity.action} <span className="font-medium text-white">{activity.target}</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          </Card>
        </section>
      </section>

      <section>
        <Card className="border border-white/10 bg-slate-950/60 p-6 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.95)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Workspace Analytics</p>
              <h2 className="text-2xl font-semibold text-white">View detailed analytics and prompt insights.</h2>
            </div>
            <Link to="/analytics">
              <Button size="sm" variant="secondary">Open Analytics</Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
