import type { Dictionary } from "../types";

const en: Dictionary = {
  common: {
    appName: "KansoOS",
    loading: "Loading...",
  },
  auth: {
    login: {
      title: "Log in",
      identifiant: "Username",
      motDePasse: "Password",
      submit: "Log in",
      submitting: "Logging in...",
      error: "Incorrect username or password.",
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
      identifiant: "Username",
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
    greeting: "Logged in as {{identifiant}}!",
  },
  language: {
    label: "Language",
    fr: "Français",
    en: "English",
  },
};

export default en;
