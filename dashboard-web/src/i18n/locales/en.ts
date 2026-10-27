import type { Dictionary } from "../types";

const en: Dictionary = {
  common: {
    appName: "KansoOS",
    loading: "Loading...",
  },
  auth: {
    login: {
      title: "Log in",
      email: "Email address",
      motDePasse: "Password",
      submit: "Log in",
      submitting: "Logging in...",
      error: "Incorrect email or password.",
    },
    totp: {
      title: "Two-factor verification",
      code: "Authenticator app code",
      submit: "Verify",
      submitting: "Verifying...",
      error: "Invalid code, please try again.",
    },
    signup: {
      title: "Create an account",
      email: "Email address",
      motDePasse: "Password",
      confirmation: "Confirm password",
      submit: "Sign up",
      submitting: "Creating...",
      success: "Account created successfully!",
      errorMismatch: "Passwords do not match.",
      errorGeneric: "Unable to create account. Please try again.",
    },
    switch: {
      toSignup: "No account?",
      toSignupAction: "Create an account",
      toLogin: "Already have an account?",
      toLoginAction: "Log in",
    },
  },
  dashboard: {
    title: "Dashboard",
    greeting: "Logged in as {{email}}!",
  },
  space: {
    idLabel: "Space ID",
    idPlaceholder: "e.g. 3f6a1c2e-...",
    show: "Show",
    change: "Change space",
    notFound: "Space not found.",
    createdAt: "Created on {{date}}",
    mandate: {
      title: "Active mandate",
      scopeTitle: "Scope",
      period: "From {{start}} to {{end}}",
      none: "No active mandate for this space.",
    },
  },
  language: {
    label: "Language",
    fr: "Français",
    en: "English",
  },
};

export default en;
