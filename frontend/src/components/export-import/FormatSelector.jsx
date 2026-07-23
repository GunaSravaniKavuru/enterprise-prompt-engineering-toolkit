import { motion } from "framer-motion";

const formats = [
  {
    value: "JSON",
    label: "JSON",
    description: "Supported export format",
  },
];

export default function FormatSelector({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {formats.map((format) => {
        const selected = value === format.value;
        return (
          <motion.button
            key={format.value}
            type="button"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onChange(format.value)}
            className={`rounded-2xl border px-4 py-3 text-left transition-all ${
              selected
                ? "border-violet-400/50 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.2)]"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <p className="text-sm font-semibold text-ink">{format.label}</p>
            <p className="mt-1 text-sm text-ink-faint">{format.description}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
