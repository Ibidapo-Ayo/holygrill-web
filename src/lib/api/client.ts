import axios from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("hg_token");

  if(token){
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
})


export default apiClient;