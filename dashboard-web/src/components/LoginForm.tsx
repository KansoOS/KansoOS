import { useState } from 'react';
import { login } from '../api';
import { useT } from '../i18n/useI18n';

interface LoginFormProps {
    // Compte avec MFA activé : il faut rejouer le code TOTP via le mfaToken.
    onMfaRequired: (mfaToken: string) => void;
    // Compte sans MFA : la connexion est déjà effective.
    onLoginSuccess: () => void;
}

function LoginForm({ onMfaRequired, onLoginSuccess }: LoginFormProps) {
    const t = useT();
    const [state, setState] = useState({
        email: '',
        password: '',
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
                    const result = await login(state.email, state.password);
                    if ('mfaRequired' in result) {
                        onMfaRequired(result.mfaToken);
                    } else {
                        onLoginSuccess();
                    }
                } catch {
                    setError(t('auth.login.error'));
                } finally {
                    setSubmitting(false);
                }
            }}>
                <div className="auth-field">
                    <label htmlFor="email">{t('auth.login.email')}</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={state.email}
                        onChange={(e) => setState({ ...state, email: e.target.value })}
                    />
                </div>
                <div className="auth-field">
                    <label htmlFor="password">{t('auth.login.motDePasse')}</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={state.password}
                        onChange={(e) => setState({ ...state, password: e.target.value })}
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
