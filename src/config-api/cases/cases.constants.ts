//

export const CASES_ROUTES = {
  GET_CASES: "/api/cases",
  GET_CASE: "/api/cases/:id",
  POST_OPEN_CASE: "/api/cases/:id/open",
  GET_USER_HISTORY: "/api/cases/history",
} as const;
