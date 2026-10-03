import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: `${BASE_URL.replace(/\/$/, "")}/api`,
  withCredentials: true,
  timeout: 10000,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    return config; // no changes needed now
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — session expired");
      // Optionally force logout using event emitter
      window.dispatchEvent(new Event("auth_expired"));
    }
    return Promise.reject(error);
  }
);

export default api;
