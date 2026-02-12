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

export const ROUTE_META: Record<
  string,
  { labelKey: string; parent?: string; dynamic?: boolean }
> = {
  "/": { labelKey: "allGames" },
  "/crash": { labelKey: "crash", parent: "/" },
  "/cases": { labelKey: "cases", parent: "/" },
  "/cases/[id]": { labelKey: "caseDetails", parent: "/cases", dynamic: true },
  "/mines": { labelKey: "mines", parent: "/" },
  "/plinko": { labelKey: "plinko", parent: "/" },
  "/profile": { labelKey: "profile", parent: "/" },
  "/bonus": { labelKey: "bonus", parent: "/" },
};
