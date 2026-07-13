import Card from "./Card";
import Icon from "./Icon";
import { motion } from "framer-motion";

export default function StatCard({ label, value, delta, trend, index = 0 }) {
  const up = trend === "up";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Card className="p-5 h-full">
        <p className="text-xs text-ink-faint uppercase tracking-wide">{label}</p>
        <div className="mt-3 flex items-end justify-between">
          <span className="font-display text-2xl font-semibold text-ink">{value}</span>
          <span
            className={`flex items-center gap-1 text-xs font-medium ${
              up ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            <Icon name={up ? "up" : "down"} size={13} />
            {delta}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
