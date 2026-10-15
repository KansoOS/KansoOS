import { useState } from 'react';
import { signup } from '../api';
import { useT } from '../i18n/useI18n';

function SignupForm() {
    const t = useT();
    const [state, setState] = useState({
        identifiant: '',
        mot_de_passe: '',
        confirmation_mot_de_passe: '',
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

                    if (state.mot_de_passe !== state.confirmation_mot_de_passe) {
                        setError(t('auth.signup.errorMismatch'));
                        return;
                    }

                    setSubmitting(true);
                    try {
                        await signup(state.identifiant, state.mot_de_passe, state.confirmation_mot_de_passe)
                        setSuccess(true);
                    } catch {
                        setError(t('auth.signup.errorGeneric'));
                    } finally {
                        setSubmitting(false);
                    }
                }}>
                    <div className="auth-field">
                        <label htmlFor="identifiant">{t('auth.signup.identifiant')}</label>
                        <input
                            type="text"
                            id="identifiant"
                            name="identifiant"
                            required
                            value={state.identifiant}
                            onChange={(e) => setState({ ...state, identifiant: e.target.value })}
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="mot_de_passe">{t('auth.signup.motDePasse')}</label>
                        <input
                            type="password"
                            id="mot_de_passe"
                            name="mot_de_passe"
                            required
                            value={state.mot_de_passe}
                            onChange={(e) => setState({ ...state, mot_de_passe: e.target.value })}
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="confirmation_mot_de_passe">{t('auth.signup.confirmation')}</label>
                        <input
                            type="password"
                            id="confirmation_mot_de_passe"
                            name="confirmation_mot_de_passe"
                            required
                            value={state.confirmation_mot_de_passe}
                            onChange={(e) => setState({ ...state, confirmation_mot_de_passe: e.target.value })}
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
