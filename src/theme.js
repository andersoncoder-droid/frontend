// theme.js
// Exports a function to create a custom MUI theme based on light or dark mode.
// Used for consistent theming across the app.

import { createTheme } from "@mui/material/styles";

// Create theme function that accepts a mode parameter
export const createAppTheme = (mode) =>
  createTheme({
    palette: {
      mode: mode,
      primary: {
        main: "#1a73e8", // Keep the same blue color for both modes
        light: "#4791db",
        dark: "#115293",
      },
      secondary: {
        main: "#00c853",
        light: "#5efc82",
        dark: "#009624",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#f5f5f5",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            // Keep the AppBar blue in both light and dark modes
            backgroundColor: "#1a73e8",
            color: "#ffffff",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 4px 12px 0 rgba(0,0,0,0.05)",
          },
        },
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 500 },
      h2: { fontWeight: 500 },
      h3: { fontWeight: 500 },
      h4: { fontWeight: 500 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
    },
    shape: {
      borderRadius: 8,
    },
  });

// createAppTheme returns a theme object for MUI based on the mode.

// Export default theme (light mode)
export default createAppTheme("light");
