import { motion } from "framer-motion";
import Card from "../common/Card";
import Icon from "../common/Icon";

const accentStyles = {
  violet: "from-violet-500/20 to-violet-400/10 text-violet-300",
  cyan: "from-cyan-500/20 to-cyan-400/10 text-cyan-300",
  amber: "from-amber-500/20 to-amber-400/10 text-amber-300",
  emerald: "from-emerald-500/20 to-emerald-400/10 text-emerald-300",
};

export default function MetricCard({ label, value, description, icon, accent = "violet", index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <Card className="group h-full border border-white/10 p-5 transition-colors duration-200 hover:border-violet-400/30">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ink-dim">{label}</p>
            <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">{value}</p>
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accentStyles[accent]}`}>
            <Icon name={icon} size={18} />
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-ink-faint">{description}</p>
      </Card>
    </motion.div>
  );
}
