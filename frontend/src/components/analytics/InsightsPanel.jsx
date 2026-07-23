import { motion } from "framer-motion";
import Card from "../common/Card";
import Icon from "../common/Icon";

const items = [
  
  
  { title: "Fastest response", value: "Gemini 2.5 Pro", detail: "1.2s median latency" },
  { title: "Top category", value: "Engineering", detail: "28% of prompt volume" },
];

export default function InsightsPanel() {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.06 * index }}
        >
          <Card className="h-full border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink-dim">{item.title}</p>
              <div className="rounded-full bg-white/8 p-2 text-violet-300">
                <Icon name="sparkle" size={14} />
              </div>
            </div>
            <p className="mt-4 font-display text-base font-semibold text-ink">{item.value}</p>
            <p className="mt-2 text-sm text-ink-faint">{item.detail}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
