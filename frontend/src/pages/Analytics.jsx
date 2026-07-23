import api from "../services/api";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";


import LoadingSkeleton from "../components/analytics/LoadingSkeleton";
import MetricCard from "../components/analytics/MetricCard";
import ModelUsageChart from "../components/analytics/ModelUsageChart";

import Card from "../components/common/Card";










export default function Analytics() {
  const [range, setRange] = useState("30d");
  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);
  const modelUsage = dashboardData
  ? Object.entries(dashboardData.model_distribution).map(
      ([model, executions]) => ({
        model,
        executions,
      })
    )
  : [];
  const handleRefresh = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 900);
  };

  
  useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/analytics/dashboard-stats");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  };

  fetchDashboardStats();
}, []);
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <AnalyticsHeader range={range} onRangeChange={setRange} onRefresh={handleRefresh} isRefreshing={loading} />

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardData && [
  {
    label: "Total Prompts",
    value: dashboardData.summary.total_managed_prompts,
    description: "Managed prompts",
    icon: "book",
    accent: "violet",
  },
  {
    label: "Playground Runs",
    value: dashboardData.summary.total_playground_executions,
    description: "Total executions",
    icon: "columns",
    accent: "amber",
  },
  {
    label: "Avg. Response Time",
    value: `${Math.round(Number(dashboardData.performance_averages.latency_ms))} ms`,
    description: "Average latency",
    icon: "clock",
    accent: "emerald",
  },
  {
    label: "Avg. Token Usage",
    value: Math.round(
      Number(dashboardData.performance_averages.token_utilization)
    ),
    description: "Average tokens",
    icon: "gauge",
    accent: "cyan",
  },
].map((metric, index) => (
  <MetricCard
    key={metric.label}
    {...metric}
    index={index}
  />
))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            

            

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

            
          </div>

          
        </>
      )}
    </div>
  );
}
