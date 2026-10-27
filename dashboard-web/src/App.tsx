import { useState } from "react"
import "./App.css"
import { useMe } from "./hooks/useMe"
import { LoginPage } from "./components/LoginPage"
import { SignupForm } from "./components/SignupForm"
import { LanguageSwitcher } from "./components/LanguageSwitcher"
import { SpaceMandateInfo } from "./components/SpaceMandateInfo"
import { I18nProvider } from "./i18n/I18nProvider"
import { useI18n } from "./i18n/useI18n"

// Il n'existe pas de route backend pour lister les espaces d'un aidant, donc
// on retient juste le dernier espace consulté, localement, et on remplacera
// ça par un vrai sélecteur dès qu'une route de listing existera côté backend.
const SPACE_ID_STORAGE_KEY = "kanso.currentSpaceId"

function readStoredSpaceId(): string | null {
  try {
    return localStorage.getItem(SPACE_ID_STORAGE_KEY)
  } catch {
    return null
  }
}

function AppContent() {
  const { data: me, loading, refetch } = useMe()
  const [showSignup, setShowSignup] = useState(false)
  const [spaceId, setSpaceId] = useState<string | null>(() => readStoredSpaceId())
  const [spaceIdInput, setSpaceIdInput] = useState("")
  const { locale, t } = useI18n()

  if (loading) {
    return (
      <div className="app">
        <p>{t("common.loading")}</p>
      </div>
    )
  }

  const setAndStoreSpaceId = (id: string | null) => {
    setSpaceId(id)
    try {
      if (id) localStorage.setItem(SPACE_ID_STORAGE_KEY, id)
      else localStorage.removeItem(SPACE_ID_STORAGE_KEY)
    } catch {
      // Ce n'est pas grave si ça échoue, le choix reste actif pour la session en cours.
    }
  }

  if (me) {
    return (
      <div className="app">
        <div className="app-header">
          <h1>{t("dashboard.title")}</h1>
          <LanguageSwitcher />
        </div>
        <div className="dashboard">
          <p>{t("dashboard.greeting", { email: me.email })}</p>
        </div>

        {spaceId ? (
          <>
            <SpaceMandateInfo spaceId={spaceId} locale={locale} />
            <p className="auth-switch">
              <button onClick={() => setAndStoreSpaceId(null)}>{t("space.change")}</button>
            </p>
          </>
        ) : (
          <form
            className="auth-card space-card"
            onSubmit={(e) => {
              e.preventDefault()
              if (spaceIdInput.trim()) setAndStoreSpaceId(spaceIdInput.trim())
            }}
          >
            <div className="auth-field">
              <label htmlFor="space-id">{t("space.idLabel")}</label>
              <input
                type="text"
                id="space-id"
                name="space-id"
                placeholder={t("space.idPlaceholder")}
                required
                value={spaceIdInput}
                onChange={(e) => setSpaceIdInput(e.target.value)}
              />
            </div>
            <button type="submit" className="auth-submit">
              {t("space.show")}
            </button>
          </form>
        )}
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
