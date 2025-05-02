// ThemeContext.jsx
// Provides theme mode context (light/dark) and toggle logic for the app.
// Persists theme mode in localStorage and updates body class.

import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
    document.body.className =
      themeMode === "dark" ? "dark-theme" : "light-theme";
  }, [themeMode]);

  // toggleThemeMode: Switches between light and dark mode.
  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
