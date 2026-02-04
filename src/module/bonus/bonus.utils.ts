export function formatBonusDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
}

export function getCountdownSeconds(nextClaimAt: string): number | null {
  const target = new Date(nextClaimAt).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((target - now) / 1000));
  return diff <= 0 ? null : diff;
}

export function formatCountdownShort(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return [h, m, s].map((n) => n.toString().padStart(2, "0")).join(":");
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}
