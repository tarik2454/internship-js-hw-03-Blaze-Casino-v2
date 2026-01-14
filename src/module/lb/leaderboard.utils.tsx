import Image from "next/image";

const RANK_ICONS: Record<number, string> = {
  1: "/images/leaderboard/first-place.svg",
  2: "/images/leaderboard/second-place.svg",
  3: "/images/leaderboard/third-place.svg",
};

export function getRankContent(rank: number) {
  const icon = RANK_ICONS[rank];

  if (!icon) return rank;

  return <Image src={icon} alt={`Rank ${rank}`} width={32} height={32} />;
}
