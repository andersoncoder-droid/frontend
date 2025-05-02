// api.js
// Axios instance for making API requests. Adds JWT token to headers if present.

import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

// Interceptor: Automatically adds JWT token from localStorage to requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["x-auth-token"] = token;
  return config;
});

export default api;
