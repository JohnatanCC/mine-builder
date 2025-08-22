// NEW FILE: src/ui/theme/ThemeProvider.tsx
import * as React from "react";

type Theme = "light" | "dark" | "system";
const STORAGE_KEY = "mb-theme";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const final = theme === "system" ? getSystemTheme() : theme;
  root.classList.toggle("dark", final === "dark");
  root.setAttribute("data-theme", final);
}

export function useTheme() {
  const [theme, setTheme] = React.useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return saved ?? "system";
  });

  React.useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  React.useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  return { theme, setTheme };
}

export const ThemeContext = React.createContext<ReturnType<typeof useTheme> | null>(null);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const value = useTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useThemeContext() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}
