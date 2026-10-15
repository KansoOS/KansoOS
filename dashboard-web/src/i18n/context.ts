import { createContext } from "react";
import fr from "./locales/fr";
import en from "./locales/en";
import type { Dictionary, TranslationKey } from "./types";

export type Locale = "fr" | "en";

export const LOCALES: Locale[] = ["fr", "en"];

export const DEFAULT_LOCALE: Locale = "fr";

export const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function isLocale(value: unknown): value is Locale {
  return value === "fr" || value === "en";
}

function resolve(dict: Dictionary, key: string): string {
  let current: unknown = dict;
  for (const part of key.split(".")) {
    if (typeof current !== "object" || current === null) return key;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : key;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

export function translate(locale: Locale, key: TranslationKey, vars?: Record<string, string | number>): string {
  return interpolate(resolve(dictionaries[locale], key), vars);
}

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

// Valeur par défaut (FR) utilisée quand un composant est rendu hors de <I18nProvider>,
// par exemple dans les tests unitaires qui montent un formulaire isolément.
const defaultContextValue: I18nContextValue = {
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key, vars) => translate(DEFAULT_LOCALE, key, vars),
};

export const I18nContext = createContext<I18nContextValue>(defaultContextValue);
