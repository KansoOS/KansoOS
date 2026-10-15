import { useState } from "react"
import "./App.css"
import { useMe } from "./hooks/useMe"
import { LoginPage } from "./components/LoginPage"
import { SignupForm } from "./components/SignupForm"
import { LanguageSwitcher } from "./components/LanguageSwitcher"
import { I18nProvider } from "./i18n/I18nProvider"
import { useT } from "./i18n/useI18n"

function AppContent() {
  const { data: me, loading, refetch } = useMe()
  const [showSignup, setShowSignup] = useState(false)
  const t = useT()

  if (loading) {
    return (
      <div className="app">
        <p>{t("common.loading")}</p>
      </div>
    )
  }

  if (me) {
    return (
      <div className="app">
        <div className="app-header">
          <h1>{t("dashboard.title")}</h1>
          <LanguageSwitcher />
        </div>
        <div className="dashboard">
          <p>{t("dashboard.greeting", { identifiant: me.identifiant })}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>{t("common.appName")}</h1>
        <LanguageSwitcher />
      </div>
      {showSignup ? (
        <>
          <SignupForm />
          <p className="auth-switch">
            {t("auth.switch.toLogin")} <button onClick={() => setShowSignup(false)}>{t("auth.switch.toLoginAction")}</button>
          </p>
        </>
      ) : (
        <>
          <LoginPage onLoginSuccess={() => refetch()} />
          <p className="auth-switch">
            {t("auth.switch.toSignup")} <button onClick={() => setShowSignup(true)}>{t("auth.switch.toSignupAction")}</button>
          </p>
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  )
}

export default App
