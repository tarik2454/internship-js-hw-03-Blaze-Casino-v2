import { AxiosRequestConfig } from "axios";

/**
 * Создаёт конфигурацию для axios запроса с опциональной авторизацией
 * @param token - Опциональный токен авторизации
 * @param additionalConfig - Дополнительная конфигурация (params, headers и т.д.)
 * @returns Конфигурация для axios запроса
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
