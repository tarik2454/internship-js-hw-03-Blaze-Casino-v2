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
  { label: string; parent?: string; dynamic?: boolean }
> = {
  "/": { label: "All games" },
  "/crash": { label: "Crash", parent: "/" },
  "/cases": { label: "Cases", parent: "/" },
  "/cases/[id]": { label: "Case Details", parent: "/cases", dynamic: true },
  "/mines": { label: "Mines", parent: "/" },
  "/plinko": { label: "Plinko", parent: "/" },
  "/profile": { label: "Profile", parent: "/" },
  "/bonus": { label: "Bonus", parent: "/" },
};
