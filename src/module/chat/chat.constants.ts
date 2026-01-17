export const ROOMS = [
  { id: "general", name: "General" },
  { id: "crash", name: "Crash" },
  { id: "mines", name: "Mines" },
  { id: "cases", name: "Cases" },
  { id: "plinko", name: "Plinko" },
];

export const ROUTE_TO_ROOM: Record<string, string> = {
  "/": "general",
  "/crash": "crash",
  "/mines": "mines",
  "/cases": "cases",
"/plinko": "plinko",
};
