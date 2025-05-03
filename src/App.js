// App.js
// Main React entry point. Sets up all providers and routes for the application.
// Uses React Router for navigation and context providers for state management.

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { AssetsProvider } from "./context/AssetsContext";
import { NotificationProvider } from "./context/NotificationContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import AssetList from "./pages/AssetList";
// Eliminar la importación de Settings
import UserManagement from "./pages/UserManagement";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <AssetsProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/map"
                  element={
                    <PrivateRoute>
                      <MapView />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/assets"
                  element={
                    <PrivateRoute>
                      <AssetList />
                    </PrivateRoute>
                  }
                />
                {/* Eliminar la ruta de Settings */}
                <Route
                  path="/users"
                  element={
                    <PrivateRoute>
                      <UserManagement />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </AssetsProvider>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
