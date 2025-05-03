// App.jsx
// Minimal App component for alternate routing. Used for testing or alternate entry.

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./components/PrivateRoute";
import React, { useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContext } from './context/ThemeContext';
import MainRouter from './MainRouter';

function App() {
  const { themeMode } = useContext(ThemeContext);

  const theme = createTheme({
    palette: {
      mode: themeMode, // 'light' o 'dark'
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainRouter />
    </ThemeProvider>
  );
}

export default App;
// Main route setup with AuthProvider and SocketProvider.
