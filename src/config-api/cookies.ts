const isProduction = process.env.NODE_ENV === "production";

export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict${isProduction ? ";Secure" : ""}`;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return decodeURIComponent(c.substring(nameEQ.length));
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=-99999999;path=/;SameSite=Strict${isProduction ? ";Secure" : ""}`;
};
