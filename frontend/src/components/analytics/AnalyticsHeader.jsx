import { motion } from "framer-motion";
import Button from "../common/Button";
import { Select } from "../common/Input";

export default function AnalyticsHeader({ range, onRangeChange, onRefresh, isRefreshing }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="sticky top-0 z-20 -mx-2 mb-2 rounded-3xl border border-white/10 bg-[rgba(10,12,20,0.8)]/80 px-4 py-4 backdrop-blur-xl sm:px-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/80">Analytics</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Prompt performance at a glance
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-dim">
            Monitor usage, model outcomes, and evaluation trends in a concise workspace view.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            label=""
            value={range}
            onChange={(e) => onRangeChange(e.target.value)}
            className="min-w-[132px]"
            options={[
              { label: "Last 7 days", value: "7d" },
              { label: "Last 30 days", value: "30d" },
              { label: "Last 90 days", value: "90d" },
            ]}
          />
          <Button variant="secondary" size="md" icon="refresh" onClick={onRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing" : "Refresh"}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
