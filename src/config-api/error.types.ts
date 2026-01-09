export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

export class ApiException extends Error implements ApiError {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "ApiException";
    this.status = status;
    this.details = details;
  }
}
