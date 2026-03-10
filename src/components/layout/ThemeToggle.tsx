"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-shadow text-lg transition-colors hover:bg-lavender/20"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
