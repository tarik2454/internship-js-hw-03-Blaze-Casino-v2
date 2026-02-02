export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

export interface ApiException extends Error, ApiError {}

export const createApiException = (
  message: string,
  status?: number,
  details?: unknown,
): ApiException => {
  const error = new Error(message) as ApiException;
  error.name = "ApiException";
  error.status = status;
  error.details = details;
  return error;
};

export const isApiException = (error: unknown): error is ApiException => {
  return error instanceof Error && error.name === "ApiException";
};
