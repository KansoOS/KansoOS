import { useState } from 'react';
import { login } from '../api';
import { useT } from '../i18n/useI18n';

function LoginForm({ onChallengeReceived }: { onChallengeReceived: (challenge: string) => void }) {
    const t = useT();
    const [state, setState] = useState({
        identifiant: '',
        mot_de_passe: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    return (
        <div className="auth-card">
            <h2>{t('auth.login.title')}</h2>
            <form onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setSubmitting(true);
                try {
                    const response = await login(state.identifiant, state.mot_de_passe);
                    onChallengeReceived(response.totp_challenge);
                } catch {
                    setError(t('auth.login.error'));
                } finally {
                    setSubmitting(false);
                }
            }}>
                <div className="auth-field">
                    <label htmlFor="username">{t('auth.login.identifiant')}</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        value={state.identifiant}
                        onChange={(e) => setState({ ...state, identifiant: e.target.value })}
                    />
                </div>
                <div className="auth-field">
                    <label htmlFor="password">{t('auth.login.motDePasse')}</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={state.mot_de_passe}
                        onChange={(e) => setState({ ...state, mot_de_passe: e.target.value })}
                    />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="auth-submit" disabled={submitting}>
                    {submitting ? t('auth.login.submitting') : t('auth.login.submit')}
                </button>
            </form>
        </div>
    );
}

export { LoginForm };
