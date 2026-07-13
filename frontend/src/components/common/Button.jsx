import { motion } from "framer-motion";
import Icon from "./Icon";

const variants = {
  primary:
    "text-white bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 shadow-[0_0_0_1px_rgba(139,92,246,0.3),0_8px_24px_-8px_rgba(139,92,246,0.55)]",
  secondary:
    "text-ink bg-white/5 hover:bg-white/10 border border-[var(--color-border-hi)]",
  ghost:
    "text-ink-dim hover:text-ink hover:bg-white/5",
  danger:
    "text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20",
};

const sizes = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-sm px-5 py-3 gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  as: As = "button",
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-150 focus-ring disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </motion.button>
  );
}
