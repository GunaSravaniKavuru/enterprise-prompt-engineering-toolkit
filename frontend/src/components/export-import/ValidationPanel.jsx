import Card from "../common/Card";
import Icon from "../common/Icon";

const toneStyles = {
  success: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-400/20 bg-amber-500/10 text-amber-300",
  error: "border-rose-400/20 bg-rose-500/10 text-rose-300",
};

export default function ValidationPanel({ tone = "success", title, message, details }) {
  return (
    <Card className={`border p-4 ${toneStyles[tone] || toneStyles.success}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-white/10 p-2">
          <Icon name={tone === "error" ? "x" : tone === "warning" ? "check" : "check"} size={14} />
        </div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm opacity-90">{message}</p>
          {details && <p className="mt-2 text-xs opacity-80">{details}</p>}
        </div>
      </div>
    </Card>
  );
}
