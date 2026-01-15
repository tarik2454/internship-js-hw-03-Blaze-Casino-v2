import axios from "axios";
import { ApiException } from "./error.types";

export const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

clientApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

clientApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      throw new ApiException(
        error.response?.data?.message ?? error.message,
        error.response?.status,
        error.response?.data,
      );
    }
    throw error;
  },
);
