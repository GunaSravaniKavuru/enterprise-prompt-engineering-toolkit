import { useState, useCallback } from "react";

// Phase 1 ships a single premium dark theme. The toggle is wired up in the
// UI for completeness and future light-mode work, but currently only
// affects local state (no visual restyle yet).
export default function useTheme() {
  const [theme, setTheme] = useState("dark");
  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);
  return [theme, toggle];
}
