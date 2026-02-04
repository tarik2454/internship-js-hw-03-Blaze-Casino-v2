import axios, { InternalAxiosRequestConfig } from "axios";
import { getGlobalApiErrorHandler } from "./apiErrorHandler";
import { createApiException } from "./error.types";
import { getCookie, setCookie, deleteCookie } from "@/config-api/cookies";
import { ROUTES } from "@/shared/constants/routes";

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
      throw createApiException("An unexpected error occurred");
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (typeof window === "undefined") {
        throw createApiException("Session expired. Please login again.", 401);
      }

      const refreshToken = getCookie("refreshToken");
      if (!refreshToken) {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        window.location.href = ROUTES.LOGIN;
        throw createApiException("Session expired. Please login again.", 401);
      }

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
          { refreshToken },
        );

        setCookie("accessToken", data.accessToken);
        if (data.refreshToken) {
          setCookie("refreshToken", data.refreshToken);
        }
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        if (axios.isAxiosError(refreshError)) {
          const status = refreshError.response?.status;
          if (status === 401 || status === 403) {
            deleteCookie("accessToken");
            deleteCookie("refreshToken");

            if (typeof window !== "undefined") {
              window.location.href = ROUTES.LOGIN;
            }

            throw createApiException(
              "Session expired. Please login again.",
              401,
            );
          }
        }

        throw createApiException(
          "Failed to refresh session. Please try again later.",
          refreshError instanceof Error ? 500 : undefined,
        );
      }
    }

    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    if (typeof window !== "undefined") {
      const handler = getGlobalApiErrorHandler();
      if (handler) handler(message);
    }

    throw createApiException(message, status, error.response?.data);
  },
);
