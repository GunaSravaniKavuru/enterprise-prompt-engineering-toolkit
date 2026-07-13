import { motion } from "framer-motion";

function toneColor(score) {
  if (score >= 85) return ["#34d399", "#22d3ee"];
  if (score >= 70) return ["#22d3ee", "#8b5cf6"];
  if (score >= 55) return ["#f5a623", "#fb7185"];
  return ["#fb7185", "#f43f5e"];
}

export default function QualityRing({ score = 0, size = 88, stroke = 8, label, sub }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const [c1, c2] = toneColor(score);
  const gradId = `qr-grad-${size}-${score}-${Math.round(Math.random() * 1e5)}`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148,156,199,0.14)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-lg font-semibold text-ink leading-none">{score}</span>
        {label && <span className="mt-1 text-[10px] uppercase tracking-wide text-ink-faint">{label}</span>}
      </div>
      {sub && <div className="absolute -bottom-5 text-[10px] text-ink-faint whitespace-nowrap">{sub}</div>}
    </div>
  );
}
