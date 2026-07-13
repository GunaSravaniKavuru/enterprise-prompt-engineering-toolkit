import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import StatCard from "../components/common/StatCard";
import QualityRing from "../components/common/QualityRing";
import PromptCard from "../components/prompt/PromptCard";
import { UsageAreaChart, ScorePieChart } from "../components/charts/Charts";
import {
  statCards, recentPrompts, recentActivity, usageSeries, scoreDistribution, currentUser,
} from "../data/dummyData";

const quickActions = [
  { label: "New Prompt", icon: "plus", to: "/builder" },
  { label: "Run in Playground", icon: "play", to: "/playground" },
  { label: "Optimize a Prompt", icon: "sparkle", to: "/optimizer" },
  { label: "Compare Models", icon: "columns", to: "/comparison" },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="relative overflow-hidden p-6 lg:p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                Welcome back, {currentUser.name.split(" ")[0]}
              </p>
              <h1 className="mt-2 font-display text-2xl font-semibold text-ink lg:text-3xl">
                Your prompt engine is running at <span className="text-gradient">87.3</span> average quality
              </h1>
              <p className="mt-2 max-w-xl text-sm text-ink-dim">
                16 active projects, 1,284 prompts under management. Three prompts need attention this week.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {quickActions.map((a) => (
                  <Link key={a.label} to={a.to}>
                    <Button variant={a.label === "New Prompt" ? "primary" : "secondary"} size="sm" icon={a.icon}>
                      {a.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 justify-center">
              <QualityRing score={87} size={128} stroke={10} label="Quality" />
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-ink">AI Usage — Last 7 Days</h2>
            <span className="text-xs text-ink-faint">Prompts executed</span>
          </div>
          <div className="mt-2">
            <UsageAreaChart data={usageSeries} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-ink">Prompt Score Overview</h2>
          <div className="mt-1">
            <ScorePieChart data={scoreDistribution} />
          </div>
          <div className="mt-2 space-y-1.5">
            {scoreDistribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-dim">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="text-ink-faint">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-ink">Recent Prompts</h2>
            <Link to="/library" className="text-xs text-violet-300 hover:text-violet-200">
              View library →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recentPrompts.slice(0, 4).map((p, i) => (
              <PromptCard key={p.id} prompt={p} index={i} />
            ))}
          </div>
        </div>

        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-ink">Recent Activity</h2>
          <ul className="mt-4 space-y-4">
            {recentActivity.map((a, i) => (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3 text-sm"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400" />
                <div>
                  <p className="text-ink-dim">
                    <span className="text-ink">{a.actor}</span> {a.action}{" "}
                    <span className="text-ink">{a.target}</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink-faint">{a.time}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
