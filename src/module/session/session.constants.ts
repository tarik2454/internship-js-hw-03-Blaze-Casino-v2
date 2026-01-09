export const SESSION_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
} as const;

export const SESSION_MODE = {
  LOGIN: "login",
  REGISTER: "register",
  LOGOUT: "logout",
} as const;

export type SessionMode = (typeof SESSION_MODE)[keyof typeof SESSION_MODE];
