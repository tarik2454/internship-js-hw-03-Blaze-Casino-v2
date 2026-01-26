import axios, { InternalAxiosRequestConfig } from "axios";
import { ApiException } from "./error.types";
import { getCookie, setCookie, deleteCookie } from "@/config-api/cookies";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const token = getCookie("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      throw new ApiException("An unexpected error occurred");
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = getCookie("refreshToken");
      if (!refreshToken) {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new ApiException("Session expired. Please login again.", 401);
      }

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
          { refreshToken },
        );

        setCookie("accessToken", data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        throw new ApiException("Session expired. Please login again.", 401);
      }
    }

    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    throw new ApiException(message, status, error.response?.data);
  },
);
