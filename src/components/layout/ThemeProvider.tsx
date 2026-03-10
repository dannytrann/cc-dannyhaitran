"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemeProvider>
  );
}
