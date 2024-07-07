import axios from "axios";
import { auth } from "./firebase";

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

service.interceptors.request.use(async (config) => {
  const user = await auth.currentUser;

  if (user) {
    const token = await user.getIdToken(true);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    return error?.response?.data;
  }
  // async (error) => {
  //   console.log(error);
  //   if (
  //     error.response?.data &&
  //     error.response.data.error.code == "auth/id-token-expired"
  //   ) {
  //     const { signOut } = useAuth();

  //     await signOut();
  //     window.location.href = "/signin";
  //   }
  // }
);

export default service;
