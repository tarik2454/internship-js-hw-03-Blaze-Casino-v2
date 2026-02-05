import { ROUTES } from "@/shared/constants/routes";

export type GameKey = "crash" | "cases" | "mines" | "plinko";
export type TagKey = "top" | "popular" | "hot" | "new";

export const GAMES_LIST: {
  id: number;
  key: GameKey;
  backgroundImage: string;
  tag: TagKey;
  href: string;
}[] = [
  {
    id: 1,
    key: "crash",
    backgroundImage: "/images/list-games/crash.png",
    tag: "top",
    href: ROUTES.CRASH,
  },
  {
    id: 2,
    key: "cases",
    backgroundImage: "/images/list-games/case.png",
    tag: "popular",
    href: ROUTES.CASES,
  },
  {
    id: 3,
    key: "mines",
    backgroundImage: "/images/list-games/mines.png",
    tag: "hot",
    href: ROUTES.MINES,
  },
  {
    id: 4,
    key: "plinko",
    backgroundImage: "/images/list-games/plinko.png",
    tag: "new",
    href: ROUTES.PLINKO,
  },
];
