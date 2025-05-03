import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

function useTheme(storageKey: string = "spacedetect-theme", defaultTheme: Theme = "system") {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  // Update theme when component mounts and when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark");
    
    // Handle system theme preference
    if (theme === "system") {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemPreference);
      return;
    }
    
    // Add current theme class
    root.classList.add(theme);
  }, [theme]);
  
  // Listen for system preference changes
  useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const listener = (event: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(event.matches ? "dark" : "light");
    };
    
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);
  
  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);
  
  return { theme, setTheme };
}

export { useTheme };
