import { LOCALES } from '../i18n/context';
import { useI18n } from '../i18n/useI18n';
import type { Locale } from '../i18n/context';

function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

function LanguageSwitcher() {
    const { locale, setLocale, t } = useI18n();

    return (
        <label className="language-switcher">
            <span className="sr-only">{t('language.label')}</span>
            <select
                value={locale}
                onChange={(e) => {
                    if (isLocale(e.target.value)) setLocale(e.target.value);
                }}
            >
                {LOCALES.map((value) => (
                    <option key={value} value={value}>
                        {t(`language.${value}`)}
                    </option>
                ))}
            </select>
        </label>
    );
}

export { LanguageSwitcher };
