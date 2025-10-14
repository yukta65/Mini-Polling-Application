import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Check for saved theme preference or default to 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const themes = {
    light: {
      // Background colors
      bgPrimary:
        "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
      bgSecondary: "rgba(0, 0, 0, 0.03)",
      bgCard: "rgba(255, 255, 255, 0.8)",
      bgCardHover: "rgba(255, 255, 255, 0.95)",
      bgGlass: "rgba(255, 255, 255, 0.7)",
      bgGlassHover: "rgba(255, 255, 255, 0.85)",

      // Navbar colors
      navbar:
        "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)",
      navbarScrolled:
        "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
      menuBg: "rgba(255, 255, 255, 0.95)",

      // Text colors
      textPrimary: "#0f172a",
      textSecondary: "#475569",
      textTertiary: "#64748b",

      // Border colors
      borderPrimary: "rgba(0, 0, 0, 0.1)",
      borderSecondary: "rgba(0, 0, 0, 0.05)",

      // Gradient orbs
      orbPrimary:
        "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
      orbSecondary:
        "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",

      // Grid pattern
      gridColor: "rgba(0, 0, 0, 0.05)",

      // Status colors
      statusBg: "rgba(16, 185, 129, 0.2)",
      statusColor: "#059669",
      statusBorder: "rgba(16, 185, 129, 0.4)",

      // Chart colors
      chartGrid: "rgba(0, 0, 0, 0.1)",
      chartTooltipBg: "rgba(255, 255, 255, 0.95)",
      chartTooltipBorder: "rgba(99, 102, 241, 0.5)",

      // Winner highlight
      winnerBg:
        "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)",
      winnerBgHover:
        "linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%)",
      winnerBorder: "rgba(99, 102, 241, 0.6)",

      // Progress bar
      progressBg: "rgba(0, 0, 0, 0.05)",
    },
    dark: {
      // Background colors
      bgPrimary:
        "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      bgSecondary: "rgba(255, 255, 255, 0.02)",
      bgCard: "rgba(255, 255, 255, 0.03)",
      bgCardHover: "rgba(255, 255, 255, 0.05)",
      bgGlass: "rgba(255, 255, 255, 0.05)",
      bgGlassHover: "rgba(255, 255, 255, 0.08)",

      // Text colors
      textPrimary: "#f1f5f9",
      textSecondary: "#94a3b8",
      textTertiary: "#64748b",

      // Border colors
      borderPrimary: "rgba(255, 255, 255, 0.1)",
      borderSecondary: "rgba(255, 255, 255, 0.05)",

      // Gradient orbs
      orbPrimary:
        "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
      orbSecondary:
        "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",

      // Grid pattern
      gridColor: "rgba(148, 163, 184, 0.05)",

      // Status colors
      statusBg: "rgba(16, 185, 129, 0.15)",
      statusColor: "#6ee7b7",
      statusBorder: "rgba(16, 185, 129, 0.3)",

      // Chart colors
      chartGrid: "rgba(148, 163, 184, 0.1)",
      chartTooltipBg: "rgba(15, 23, 42, 0.95)",
      chartTooltipBorder: "rgba(99, 102, 241, 0.5)",

      // Winner highlight
      winnerBg:
        "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)",
      winnerBgHover:
        "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)",
      winnerBorder: "rgba(99, 102, 241, 0.5)",

      // Progress bar
      progressBg: "rgba(255, 255, 255, 0.05)",
    },
  };

  const value = {
    theme,
    toggleTheme,
    colors: themes[theme],
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
