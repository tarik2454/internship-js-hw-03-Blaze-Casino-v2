import en from "./locales/en.json";
import uk from "./locales/uk.json";

const messages = { en, uk } as const;

export type Locale = keyof typeof messages;

export function getTranslations(locale: Locale) {
  return messages[locale] ?? messages.en;
}
