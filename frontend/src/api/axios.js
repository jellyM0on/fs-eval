import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Integrate with demo authentication
api.interceptors.request.use((config) => {
  const id = localStorage.getItem("userId");
  if (id) config.headers["X-Demo-UserId"] = id;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      try {
        window.location.href = "/login";
      } catch (err) {
        console.error(err);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
