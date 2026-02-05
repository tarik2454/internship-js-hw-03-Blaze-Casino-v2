import { AxiosRequestConfig } from "axios";

/**
 * Creates a configuration for an axios request with optional authorization
 * @param token - Optional authorization token
 * @param additionalConfig - Additional configuration (params, headers, etc.)
 * @returns Configuration for axios request
 */
export function createAuthConfig(
  token?: string,
  additionalConfig?: AxiosRequestConfig,
): AxiosRequestConfig {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  return {
    ...additionalConfig,
    headers: {
      ...additionalConfig?.headers,
      ...headers,
    },
  };
}
