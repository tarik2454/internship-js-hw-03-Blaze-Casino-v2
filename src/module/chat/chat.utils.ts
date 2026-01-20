export const formatTime = (iso: string) => {
  const date = new Date(iso);
  if (isNaN(date.getTime())) {
    return "00:00 AM";
  }
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};
