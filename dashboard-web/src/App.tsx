import { useEffect, useState } from "react"
import "./App.css"
import { logout } from "./api"
import { useMe } from "./hooks/useMe"
import { LoginPage } from "./components/LoginPage"
import { SignupForm } from "./components/SignupForm"
import { LanguageSwitcher } from "./components/LanguageSwitcher"
import { SpaceMandateInfo } from "./components/SpaceMandateInfo"
import { DevicesPanel } from "./components/DevicesPanel"
import { DevicesSummary } from "./components/DevicesSummary"
import { Footer } from "./components/Footer"
import { ShieldIcon, LogoutIcon, BuildingIcon, PhoneIcon, LockIcon, ScrollIcon } from "./components/icons"
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

type Tab = "overview" | "devices"

function AppContent() {
  const { data: me, loading, refetch } = useMe()
  const [showSignup, setShowSignup] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [spaceId, setSpaceId] = useState<string | null>(() => readStoredSpaceId())
  const [spaceIdInput, setSpaceIdInput] = useState("")
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const { locale, t } = useI18n()

  // La carte de connexion n'apparaît qu'au clic sur le bouton de la topbar,
  // donc on attend qu'elle soit montée pour amener le focus sur le champ e-mail.
  useEffect(() => {
    if (!showAuth) return
    const email = document.getElementById("email") as HTMLInputElement | null
    if (!email) return
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    email.focus({ preventScroll: true })
    email.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" })
  }, [showAuth])

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

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      // Un autre aidant pourrait se connecter ensuite sur ce même navigateur,
      // donc on ne laisse pas traîner le choix d'espace de la session précédente.
      setAndStoreSpaceId(null)
      setActiveTab("overview")
      refetch()
    }
  }


  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: t("tabs.overview") },
    { id: "devices", label: t("tabs.devices") },
  ]

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const next = e.key === "ArrowRight" ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length
    setActiveTab(tabs[next].id)
    document.getElementById(`tab-${tabs[next].id}`)?.focus()
  }

  if (me) {
    const avatarLetter = me.email.charAt(0).toUpperCase()

    return (
      <div className="app dashboard-app">
        <a className="skip-link" href="#main-content">{t("common.skipToContent")}</a>

        <header className="dashboard-nav">
          <div className="dashboard-nav-brand">
            <ShieldIcon />
            <h1>{t("dashboard.title")}</h1>
          </div>
          <div className="dashboard-nav-actions">
            <LanguageSwitcher />
            <span className="user-avatar" title={me.email} aria-label={me.email}>
              {avatarLetter}
            </span>
            <button className="logout-button" onClick={handleLogout}>
              <LogoutIcon />
              <span className="logout-button-label">{t("nav.logout")}</span>
            </button>
          </div>
        </header>

        <main className="dashboard-main" id="main-content">
          <p className="dashboard-greeting">{t("dashboard.greeting", { email: me.email })}</p>

          <div className="tabs" role="tablist" aria-label={t("tabs.label")}>
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
              >
                {tab.id === "overview" ? <BuildingIcon /> : <PhoneIcon />}
                {tab.label}
              </button>
            ))}
          </div>

          <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" hidden={activeTab !== "overview"}>
            {spaceId ? (
              <>
                <SpaceMandateInfo spaceId={spaceId} locale={locale} />
                <DevicesSummary spaceId={spaceId} onViewDevices={() => setActiveTab("devices")} />
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
                  <p className="field-explain">{t("space.idExplain")}</p>
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

          <div id="panel-devices" role="tabpanel" aria-labelledby="tab-devices" hidden={activeTab !== "devices"}>
            {spaceId ? <DevicesPanel spaceId={spaceId} locale={locale} /> : <p className="devices-no-space">{t("devices.noSpace")}</p>}
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="app landing-page">
      <a className="skip-link" href="#main-content">{t("common.skipToContent")}</a>

      <div className="app-header">
        <div className="app-header-brand">
          <ShieldIcon />
          <h1>{t("common.appName")}</h1>
        </div>
        <div className="app-header-actions">
          <LanguageSwitcher />
          <button type="button" className="nav-cta-button" onClick={() => setShowAuth(true)}>
            {t("nav.login")}
          </button>
        </div>
      </div>

      <main id="main-content" className="landing-main">
        <section className={`landing-hero ${showAuth ? "" : "landing-hero-solo"}`}>
          <div className="landing-hero-copy">
            <h2 className="landing-title">{t("landing.heroTitle")}</h2>
            <p className="landing-subtitle">{t("landing.heroSubtitle")}</p>
          </div>

          {showAuth && (
            <div className="landing-auth">
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
          )}
        </section>

        <section className="landing-features">
          <div className="landing-feature">
            <span className="landing-feature-icon"><ScrollIcon /></span>
            <h3>{t("landing.feature1Title")}</h3>
            <p>{t("landing.feature1Body")}</p>
          </div>
          <div className="landing-feature">
            <span className="landing-feature-icon"><PhoneIcon /></span>
            <h3>{t("landing.feature2Title")}</h3>
            <p>{t("landing.feature2Body")}</p>
          </div>
          <div className="landing-feature">
            <span className="landing-feature-icon"><LockIcon /></span>
            <h3>{t("landing.feature3Title")}</h3>
            <p>{t("landing.feature3Body")}</p>
          </div>
        </section>
      </main>
      <Footer />
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
