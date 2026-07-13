export default function Card({ children, className = "", hi = false, as: As = "div", ...props }) {
  return (
    <As className={`${hi ? "glass-hi" : "glass"} rounded-2xl ${className}`} {...props}>
      {children}
    </As>
  );
}
