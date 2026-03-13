"use client";

import * as React from "react";

const STORAGE_KEY = "pogo-theme";

type ThemeContextValue = {
  isDark: boolean;
  toggle: () => void;
  setTheme: (value: boolean) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial = stored === "dark";
    setIsDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const setTheme = React.useCallback((value: boolean) => {
    setIsDark(value);
    document.documentElement.classList.toggle("dark", value);
    localStorage.setItem(STORAGE_KEY, value ? "dark" : "light");
  }, []);

  const toggle = React.useCallback(() => {
    setTheme(!isDark);
  }, [isDark, setTheme]);

  const value = React.useMemo(
    () => ({ isDark, toggle, setTheme }),
    [isDark, toggle, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
