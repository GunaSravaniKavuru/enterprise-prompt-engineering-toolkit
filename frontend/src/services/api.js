import axios from "axios";

// Phase 1 stub only. No requests are made from this prototype yet.
// Once the backend is ready, point baseURL at the FastAPI service and
// start replacing dummy-data imports in pages with calls through this client.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
