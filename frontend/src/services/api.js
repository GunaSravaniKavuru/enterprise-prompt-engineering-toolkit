import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically ensure endpoints end with a trailing slash to avoid 307/308 redirects
api.interceptors.request.use(
  (config) => {
    // Append a trailing slash to URL if it doesn't already have one (and ignores query params)
    if (config.url && !config.url.includes("?") && !config.url.endsWith("/")) {
      config.url += "/";
    }

    // Automatically attach JWT token to every request
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;