import { motion } from "framer-motion";

export default function MetricCard({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-dim">{label}</span>
        <span className="font-mono text-ink">{value}</span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
