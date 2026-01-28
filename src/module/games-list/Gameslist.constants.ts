import { ROUTES } from "@/shared/constants/routes";

export enum GameTags {
  TOP = "Top",
  POPULAR = "Popular",
  HOT = "Hot",
  NEW = "New",
}

export const GAMES_LIST = [
  {
    id: 1,
    name: "Crash",
    description: "Watch the multiplier rise and cash out before it’s gone",
    backgroundImage: "/images/list-games/crash.png",
    tag: GameTags.TOP,
    href: ROUTES.CRASH,
  },
  {
    id: 2,
    name: "Cases",
    description: "Open cases and win random rewards",
    backgroundImage: "/images/list-games/case.png",
    tag: GameTags.POPULAR,
    href: ROUTES.CASES,
  },
  {
    id: 3,
    name: "Mines",
    description: "Avoid the mines and collect bigger rewards",
    backgroundImage: "/images/list-games/mines.png",
    tag: GameTags.HOT,
    href: ROUTES.MINES,
  },
  {
    id: 4,
    name: "Plinko",
    description: "Drop the ball, watch it bounce, and win prizes",
    backgroundImage: "/images/list-games/plinko.png",
    tag: GameTags.NEW,
    href: ROUTES.PLINKO,
  },
];
