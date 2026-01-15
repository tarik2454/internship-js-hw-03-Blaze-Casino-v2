export const ROOMS = [
  { id: "general", name: "General Chat" },
  { id: "crash", name: "Crash Chat" },
];

export const ROUTE_TO_ROOM: Record<string, string> = {
  "/": "general",
  "/crash": "crash",
};
