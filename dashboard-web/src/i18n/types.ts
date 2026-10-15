// Forme du dictionnaire de traduction : une clé par libellé, regroupée par écran/domaine.
// fr.ts est la source de vérité ; chaque autre langue doit respecter exactement cette forme.
export interface Dictionary {
  common: {
    appName: string;
    loading: string;
  };
  auth: {
    login: {
      title: string;
      identifiant: string;
      motDePasse: string;
      submit: string;
      submitting: string;
      error: string;
    };
    totp: {
      title: string;
      code: string;
      submit: string;
      submitting: string;
      error: string;
    };
    signup: {
      title: string;
      identifiant: string;
      motDePasse: string;
      confirmation: string;
      submit: string;
      submitting: string;
      success: string;
      errorMismatch: string;
      errorGeneric: string;
    };
    switch: {
      toSignup: string;
      toSignupAction: string;
      toLogin: string;
      toLoginAction: string;
    };
  };
  dashboard: {
    title: string;
    greeting: string;
  };
  language: {
    label: string;
    fr: string;
    en: string;
  };
}

/** Union de toutes les clés en notation pointée, ex. "auth.login.title". */
export type TranslationKey = {
  [K in keyof Dictionary & string]: Dictionary[K] extends string
    ? K
    : `${K}.${Paths<Dictionary[K]>}`;
}[keyof Dictionary & string];

type Paths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`;
}[keyof T & string];
