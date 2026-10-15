import { useState } from "react";
import { verifyTotp } from "../api";
import { useT } from "../i18n/useI18n";

function TotpForm({ totpChallenge, onLoginSuccess }: { totpChallenge: string; onLoginSuccess: () => void }) {
    const t = useT();
    const [totpCode, setTotpCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    return (
        <div className="auth-card">
            <h2>{t('auth.totp.title')}</h2>
            <form onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setSubmitting(true);
                try {
                    await verifyTotp(totpChallenge, totpCode);
                    onLoginSuccess();
                } catch {
                    setError(t('auth.totp.error'));
                } finally {
                    setSubmitting(false);
                }
            }}>
                <div className="auth-field">
                    <label htmlFor="totp">{t('auth.totp.code')}</label>
                    <input
                        type="text"
                        id="totp"
                        name="totp"
                        required
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value)}
                    />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="auth-submit" disabled={submitting}>
                    {submitting ? t('auth.totp.submitting') : t('auth.totp.submit')}
                </button>
            </form>
        </div>
    );
}

export { TotpForm };
