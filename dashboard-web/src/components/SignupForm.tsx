import { useState } from 'react';
import { signup } from '../api';
import { useT } from '../i18n/useI18n';

function SignupForm() {
    const t = useT();
    const [state, setState] = useState({
        email: '',
        password: '',
        confirmationPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState(false);

    return (
        <div className="auth-card">
            <h2>{t('auth.signup.title')}</h2>
            {success ? (
                <p>{t('auth.signup.success')}</p>
            ) : (
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setError(null);

                    if (state.password !== state.confirmationPassword) {
                        setError(t('auth.signup.errorMismatch'));
                        return;
                    }

                    setSubmitting(true);
                    try {
                        await signup(state.email, state.password)
                        setSuccess(true);
                    } catch {
                        setError(t('auth.signup.errorGeneric'));
                    } finally {
                        setSubmitting(false);
                    }
                }}>
                    <div className="auth-field">
                        <label htmlFor="email">{t('auth.signup.email')}</label>
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
                        <label htmlFor="password">{t('auth.signup.motDePasse')}</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={state.password}
                            onChange={(e) => setState({ ...state, password: e.target.value })}
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="confirmation_password">{t('auth.signup.confirmation')}</label>
                        <input
                            type="password"
                            id="confirmation_password"
                            name="confirmation_password"
                            required
                            value={state.confirmationPassword}
                            onChange={(e) => setState({ ...state, confirmationPassword: e.target.value })}
                        />
                    </div>
                    {error && <p className="auth-error">{error}</p>}
                    <button type="submit" className="auth-submit" disabled={submitting}>
                        {submitting ? t('auth.signup.submitting') : t('auth.signup.submit')}
                    </button>
                </form>
            )}
        </div>
    );
}

export { SignupForm };
