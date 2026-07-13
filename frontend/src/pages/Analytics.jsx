import Card from "../components/common/Card";
import StatCard from "../components/common/StatCard";
import {
  UsageAreaChart, TrendLineChart, CategoryBarChart, ResponseTimeBarChart,
} from "../components/charts/Charts";
import { analyticsSeries, statCards } from "../data/dummyData";

export default function Analytics() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-ink-dim">Usage, quality, and performance trends across your workspace.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-ink">Daily Prompt Usage</h2>
          <div className="mt-2"><UsageAreaChart data={analyticsSeries.dailyUsage} dataKey="prompts" /></div>
        </Card>
        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-ink">Prompt Success Rate</h2>
          <div className="mt-2"><TrendLineChart data={analyticsSeries.successRate} dataKey="rate" xKey="day" /></div>
        </Card>
        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-ink">Prompt Categories</h2>
          <div className="mt-2"><CategoryBarChart data={analyticsSeries.categories} /></div>
        </Card>
        <Card className="p-5">
          <h2 className="font-display text-sm font-semibold text-ink">Average Response Time by Model</h2>
          <div className="mt-2"><ResponseTimeBarChart data={analyticsSeries.responseTime} /></div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-display text-sm font-semibold text-ink">Average Score Trend (Monthly)</h2>
        <div className="mt-2">
          <TrendLineChart data={analyticsSeries.avgScoreTrend} dataKey="score" xKey="week" />
        </div>
      </Card>
    </div>
  );
}
