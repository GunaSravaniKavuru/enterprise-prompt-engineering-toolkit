export function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium text-ink-dim">{label}</span>}
      <input
        className={`w-full rounded-xl border border-[var(--color-border-soft)] bg-white/5 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-ring outline-none transition-colors focus:border-violet-400/50 ${className}`}
        {...props}
      />
    </label>
  );
}

export function Textarea({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium text-ink-dim">{label}</span>}
      <textarea
        className={`w-full rounded-xl border border-[var(--color-border-soft)] bg-white/5 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-ring outline-none transition-colors focus:border-violet-400/50 resize-none ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, options = [], className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium text-ink-dim">{label}</span>}
      <select
        className={`w-full rounded-xl border border-[var(--color-border-soft)] bg-[#12141f] px-3.5 py-2.5 text-sm text-ink focus-ring outline-none transition-colors focus:border-violet-400/50 ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
    </label>
  );
}
