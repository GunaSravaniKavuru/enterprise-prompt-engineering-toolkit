export default function Loader({ label = "Loading", size = 20 }) {
  return (
    <div className="flex items-center gap-2 text-ink-dim text-sm">
      <span
        className="inline-block animate-spin rounded-full border-2 border-white/10 border-t-violet-400"
        style={{ width: size, height: size }}
      />
      {label}
    </div>
  );
}
