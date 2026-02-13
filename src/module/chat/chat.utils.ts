export const formatTime = (iso: string, locale: string = "en"): string => {
  const date = new Date(iso);
  if (isNaN(date.getTime())) {
    return "00:00";
  }
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};
