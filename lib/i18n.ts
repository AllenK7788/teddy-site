import en from "@/dictionaries/en.json";
import th from "@/dictionaries/th.json";
import zh from "@/dictionaries/zh.json";

export const locales = ["en", "th", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries = { en, th, zh };

export function getDictionary(locale: string) {
  return dictionaries[(locale as Locale) in dictionaries ? (locale as Locale) : defaultLocale];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
