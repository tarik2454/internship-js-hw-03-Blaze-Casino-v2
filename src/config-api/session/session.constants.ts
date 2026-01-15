export const SESSION_ROUTES = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  LOGOUT: "/api/auth/logout",
  ME: "/api/auth/me",
} as const;

export const SESSION_MODE = {
  LOGIN: "login",
  REGISTER: "register",
} as const;

export type SessionMode = (typeof SESSION_MODE)[keyof typeof SESSION_MODE];
