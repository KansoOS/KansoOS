import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { TotpForm } from './TotpForm';

function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [totpChallenge, setTotpChallenge] = useState<string | null>(null);

    if (totpChallenge) {
        return <TotpForm totpChallenge={totpChallenge} onLoginSuccess={onLoginSuccess} />;
    }

    return <LoginForm onChallengeReceived={(challenge) => setTotpChallenge(challenge)} />;
}

export { LoginPage };