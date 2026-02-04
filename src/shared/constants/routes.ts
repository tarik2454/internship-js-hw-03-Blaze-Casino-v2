export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  LEADERBOARD: "/leaderboard",
  CRASH: "/crash",
  CASES: "/cases",
  CASE_DETAIL: (id: string) => `/cases/${id}`,
  MINES: "/mines",
  PLINKO: "/plinko",
  BONUS: "/bonus",
} as const;
