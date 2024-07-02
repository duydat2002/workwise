import axios from "axios";

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

service.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

service.interceptors.response.use((response) => {
  return response.data;
});

export default service;
