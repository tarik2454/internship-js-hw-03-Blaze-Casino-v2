export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
} as const;

export const AUTH_MODE = {
  LOGIN: "login",
  REGISTER: "register",
} as const;

export type AuthMode = (typeof AUTH_MODE)[keyof typeof AUTH_MODE];
