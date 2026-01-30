const RARITIES = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "gold",
] as const;
export type RarityClassKey = (typeof RARITIES)[number];

export function getRarityClasses(
  rarity: string,
  styles: Record<string, string>,
): Record<string, boolean> {
  const r = rarity.toLowerCase();
  return RARITIES.reduce<Record<string, boolean>>((acc, key) => {
    const className = styles[key];
    if (className) acc[className] = r === key;
    return acc;
  }, {});
}
