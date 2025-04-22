import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Move loadUser to useCallback to avoid dependency issues
  const loadUser = useCallback(async () => {
    try {
      // Decode JWT to get user info
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser(decoded.user);
      setLoading(false);
    } catch (err) {
      console.error("Error loading user:", err);
      setToken(null);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Set token in localStorage and axios headers
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["x-auth-token"] = token;
      loadUser();
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
      setUser(null);
      setLoading(false);
    }
  }, [token, loadUser]);

  // Login user
  const login = async (email, password) => {
    try {
      // For development/testing purposes, allow a hardcoded login
      if (email === "admin@decimetrix.com" && password === "admin123") {
        // Create a mock token with admin role
        const mockToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTYxNjc2MjcwMCwiZXhwIjoxNjE2ODQ5MTAwfQ.mock-signature";
        setToken(mockToken);
        return true;
      } else if (
        email === "operator@decimetrix.com" &&
        password === "operator123"
      ) {
        // Create a mock token with operator role
        const mockToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1c2VybmFtZSI6Im9wZXJhdG9yIiwicm9sZSI6Im9wZXJhdG9yIn0sImlhdCI6MTYxNjc2MjcwMCwiZXhwIjoxNjE2ODQ5MTAwfQ.mock-signature";
        setToken(mockToken);
        return true;
      }

      // If no hardcoded credentials match, return false
      return false;
    } catch (err) {
      console.error("Login error:", err.response?.data?.msg || err.message);
      return false;
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      // In a real application, you would make an API call here
      // const res = await axios.post('http://localhost:5000/api/auth/register', userData);
      // setToken(res.data.token);
      return true;
    } catch (err) {
      console.error("Register error:", err.response?.data?.msg || err.message);
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
