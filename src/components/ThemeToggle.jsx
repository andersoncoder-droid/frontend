// ThemeToggle.jsx
// Button to toggle between light and dark theme modes using ThemeContext.

import React, { useContext } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { themeMode, toggleThemeMode } = useContext(ThemeContext);

  return (
    <Tooltip
      title={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}
    >
      <IconButton onClick={toggleThemeMode} color="inherit">
        {themeMode === "light" ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
