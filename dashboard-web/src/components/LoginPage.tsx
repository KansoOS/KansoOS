import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { TotpForm } from './TotpForm';

function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [mfaToken, setMfaToken] = useState<string | null>(null);

    if (mfaToken) {
        return <TotpForm mfaToken={mfaToken} onLoginSuccess={onLoginSuccess} />;
    }

    return <LoginForm onMfaRequired={(token) => setMfaToken(token)} onLoginSuccess={onLoginSuccess} />;
}

export { LoginPage };
