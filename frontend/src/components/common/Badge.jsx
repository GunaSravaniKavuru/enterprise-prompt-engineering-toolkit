const tones = {
  neutral: "bg-white/5 text-ink-dim border-[var(--color-border-soft)]",
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-300 border-rose-500/20",

  lime: "bg-lime-500/10 text-lime-300 border-lime-500/20",
  blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  red: "bg-red-500/10 text-red-300 border-red-500/20",
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
