import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_LOCALE, I18nContext, isLocale, translate } from "./context";
import type { Locale } from "./context";

const STORAGE_KEY = "kanso.locale";

function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    // localStorage indisponible (navigation privée, SSR...) : on ignore et retombe sur le défaut.
    return null;
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale() ?? DEFAULT_LOCALE);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Pas grave si on ne peut pas persister : le choix reste actif pour la session en cours.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: Parameters<typeof translate>[1], vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
