"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const themes = [
  { id: "ledger", label: "Ledger", swatch: "#F6F3EC" },
  { id: "dark", label: "Dark", swatch: "#16161F" },
  { id: "dusk", label: "Dusk", swatch: "#7A3FA6" },
  { id: "forest", label: "Forest", swatch: "#3E7C55" },
  { id: "ocean", label: "Ocean", swatch: "#2F6F9E" },
] as const;

export type ThemeId = (typeof themes)[number]["id"];

const STORAGE_KEY = "ledger-theme";

const ThemeContext = createContext<{
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}>({ theme: "ledger", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(() => {
    if (typeof window === "undefined") return "ledger";
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    return saved && themes.some((t) => t.id === saved) ? saved : "ledger";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}