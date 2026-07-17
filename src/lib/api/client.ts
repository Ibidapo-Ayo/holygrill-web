import axios from "axios";
import Cookies from "js-cookie";
import { AUTH_TOKEN_COOKIE_NAME } from "../auth-session";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? Cookies.get(AUTH_TOKEN_COOKIE_NAME) : undefined;

  if(token){
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
})


export default apiClient;