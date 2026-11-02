// Forme du dictionnaire de traduction : une clé par libellé, regroupée par écran/domaine.
// fr.ts est la source de vérité ; chaque autre langue doit respecter exactement cette forme.
export interface Dictionary {
  common: {
    appName: string;
    loading: string;
    skipToContent: string;
  };
  auth: {
    login: {
      title: string;
      email: string;
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
      email: string;
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
  nav: {
    logout: string;
    login: string;
  };
  tabs: {
    label: string;
    overview: string;
    devices: string;
  };
  devices: {
    title: string;
    noSpace: string;
    summary: string;
    summaryAttention: string;
    empty: string;
    statusOk: string;
    statusAttention: string;
    lastSync: string;
    add: string;
    addTitle: string;
    addInstructions: string;
    codeLabel: string;
    expiresAt: string;
    close: string;
    revoke: string;
    revokeConfirm: string;
    errorGeneric: string;
    viewAll: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    feature1Title: string;
    feature1Body: string;
    feature2Title: string;
    feature2Body: string;
    feature3Title: string;
    feature3Body: string;
  };
  footer: {
    dataMinimization: string;
    privacyToggle: string;
    privacyDetail: string;
    legalToggle: string;
    legalDetail: string;
    contactToggle: string;
    contactDetail: string;
    copyright: string;
  };
  space: {
    idLabel: string;
    idExplain: string;
    idPlaceholder: string;
    show: string;
    change: string;
    notFound: string;
    createdAt: string;
    mandate: {
      title: string;
      scopeTitle: string;
      period: string;
      none: string;
    };
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
