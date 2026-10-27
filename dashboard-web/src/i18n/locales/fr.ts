import type { Dictionary } from "../types";

// Source de vérité : libellés repris tels quels de l'UI d'origine (pour ne pas casser les tests).
const fr: Dictionary = {
  common: {
    appName: "KansoOS",
    loading: "Chargement...",
  },
  auth: {
    login: {
      title: "Connexion",
      email: "Adresse e-mail",
      motDePasse: "Mot de passe",
      submit: "Se connecter",
      submitting: "Connexion...",
      error: "Adresse e-mail ou mot de passe incorrect.",
    },
    totp: {
      title: "Vérification en deux étapes",
      code: "Code de l'application d'authentification",
      submit: "Vérifier",
      submitting: "Vérification...",
      error: "Code invalide, réessayez.",
    },
    signup: {
      title: "Créer un compte",
      email: "Adresse e-mail",
      motDePasse: "Mot de passe",
      confirmation: "Confirmer le mot de passe",
      submit: "S'inscrire",
      submitting: "Création...",
      success: "Compte créé avec succès !",
      errorMismatch: "Les mots de passe ne correspondent pas.",
      errorGeneric: "Impossible de créer le compte. Réessayez.",
    },
    switch: {
      toSignup: "Pas de compte ?",
      toSignupAction: "Créer un compte",
      toLogin: "Déjà un compte ?",
      toLoginAction: "Se connecter",
    },
  },
  dashboard: {
    title: "Dashboard",
    greeting: "Connecté en tant que {{email}} !",
  },
  space: {
    idLabel: "Identifiant de l'espace",
    idPlaceholder: "ex. 3f6a1c2e-...",
    show: "Afficher",
    change: "Changer d'espace",
    notFound: "Espace introuvable.",
    createdAt: "Créé le {{date}}",
    mandate: {
      title: "Mandat en vigueur",
      scopeTitle: "Périmètre",
      period: "Du {{start}} au {{end}}",
      none: "Aucun mandat en vigueur pour cet espace.",
    },
  },
  language: {
    label: "Langue",
    fr: "Français",
    en: "English",
  },
};

export default fr;
