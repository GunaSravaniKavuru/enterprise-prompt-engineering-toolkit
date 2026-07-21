import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import ActivityChart from "../components/analytics/ActivityChart";
import CategoryChart from "../components/analytics/CategoryChart";
import EvaluationScoreChart from "../components/analytics/EvaluationScoreChart";
import InsightsPanel from "../components/analytics/InsightsPanel";
import LoadingSkeleton from "../components/analytics/LoadingSkeleton";
import MetricCard from "../components/analytics/MetricCard";
import ModelUsageChart from "../components/analytics/ModelUsageChart";
import RecentActivityTable from "../components/analytics/RecentActivityTable";
import Card from "../components/common/Card";
import { analyticsSeries } from "../data/dummyData";

const metrics = [
  { label: "Total prompts", value: "1,284", description: "Across 16 active prompt families", icon: "book", accent: "violet" },
  { label: "Average evaluation score", value: "87.3", description: "Consistently above target quality thresholds", icon: "gauge", accent: "cyan" },
  { label: "Total comparisons", value: "248", description: "Model evaluations completed this month", icon: "columns", accent: "amber" },
  { label: "Avg. response time", value: "1.8s", description: "Fastest-response models in the mix", icon: "clock", accent: "emerald" },
  { label: "Estimated token usage", value: "482K", description: "Tokens processed across all prompt runs", icon: "sparkle", accent: "violet" },
  { label: "Estimated total cost", value: "$3,820", description: "Projected run cost for the selected range", icon: "chart", accent: "cyan" },
];

const recentRows = [
  { id: "1", prompt: "Customer Churn Diagnosis Agent", action: "Optimized", model: "Claude Sonnet 5", date: "2h ago", status: "Success" },
  { id: "2", prompt: "Refund Policy Assistant", action: "Created", model: "GPT-5", date: "4h ago", status: "Active" },
  { id: "3", prompt: "Legal Clause Simplifier", action: "Reviewed", model: "Gemini 2.5 Pro", date: "6h ago", status: "Warning" },
  { id: "4", prompt: "SQL Query Explainer", action: "Compared", model: "GPT-5", date: "8h ago", status: "Success" },
  { id: "5", prompt: "Onboarding Email Sequence", action: "Restored", model: "Claude Sonnet 5", date: "Yesterday", status: "Active" },
  { id: "6", prompt: "Support Ticket Triage", action: "Evaluated", model: "Gemini 2.5 Pro", date: "Yesterday", status: "Success" },
  { id: "7", prompt: "Release Notes Summarizer", action: "Updated", model: "Llama 4", date: "2d ago", status: "Warning" },
  { id: "8", prompt: "Data Privacy FAQ Bot", action: "Optimized", model: "Claude Sonnet 5", date: "2d ago", status: "Success" },
  { id: "9", prompt: "Ad Copy A/B Generator", action: "Drafted", model: "GPT-5", date: "3d ago", status: "Active" },
  { id: "10", prompt: "Customer Success Reply Agent", action: "Reviewed", model: "Gemini 2.5 Pro", date: "3d ago", status: "Success" },
];

const modelUsage = [
  { model: "GPT-5", executions: 184 },
  { model: "Claude Sonnet 5", executions: 154 },
  { model: "Gemini 2.5 Pro", executions: 128 },
  { model: "Llama 4", executions: 96 },
];

const scoreBreakdown = [
  { category: "Engineering", score: 92 },
  { category: "Marketing", score: 88 },
  { category: "Support", score: 86 },
  { category: "Legal", score: 81 },
  { category: "Analytics", score: 90 },
];

export default function Analytics() {
  const [range, setRange] = useState("30d");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 900);
  };

  const filteredRows = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return recentRows.filter((row) => row.prompt.toLowerCase().includes(query) || row.model.toLowerCase().includes(query) || row.status.toLowerCase().includes(query));
  }, [searchQuery]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <AnalyticsHeader range={range} onRangeChange={setRange} onRefresh={handleRefresh} isRefreshing={loading} />

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => (
              <MetricCard key={metric.label} {...metric} index={index} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
              <Card className="h-full border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">Prompt activity trend</p>
                    <p className="mt-1 text-sm text-ink-dim">Daily prompt creation and usage across the selected range.</p>
                  </div>
                </div>
                <ActivityChart data={analyticsSeries.dailyUsage} />
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.04 }}>
              <Card className="h-full border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">Prompt categories</p>
                    <p className="mt-1 text-sm text-ink-dim">Distribution of prompt volume by functional category.</p>
                  </div>
                </div>
                <CategoryChart data={analyticsSeries.categories} />
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.08 }}>
              <Card className="h-full border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">Model usage</p>
                    <p className="mt-1 text-sm text-ink-dim">Execution count by model for the latest period.</p>
                  </div>
                </div>
                <ModelUsageChart data={modelUsage} />
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.12 }}>
              <Card className="h-full border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">Evaluation score distribution</p>
                    <p className="mt-1 text-sm text-ink-dim">Average evaluation score grouped by prompt category.</p>
                  </div>
                </div>
                <EvaluationScoreChart data={scoreBreakdown} />
              </Card>
            </motion.div>
          </div>

          <InsightsPanel />
          <RecentActivityTable rows={filteredRows} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </>
      )}
    </div>
  );
}
