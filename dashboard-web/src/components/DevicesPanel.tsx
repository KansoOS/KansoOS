import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { createPairingCode, revokeDevice } from '../api';
import { useAsync } from '../hooks/useAsync';
import { useDevices } from '../hooks/useDevices';
import { useT } from '../i18n/useI18n';
import { AlertIcon, CheckCircleIcon, PhoneIcon, PlusIcon, TrashIcon } from './icons';
import { isHealthy } from './deviceStatus';

function formatDateTime(iso: string, locale: string): string {
    return new Date(iso).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
}

function PairingDialog({
    spaceId,
    locale,
    onClose,
    onPaired,
}: {
    spaceId: string;
    locale: string;
    onClose: () => void;
    onPaired: () => void;
}) {
    const t = useT();
    const { data: pairing, loading, error } = useAsync(() => createPairingCode(spaceId), [spaceId]);
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!pairing) return;
        let cancelled = false;
        QRCode.toDataURL(pairing.code, { margin: 1, width: 220 }).then((url) => {
            if (!cancelled) setQrDataUrl(url);
        });
        return () => {
            cancelled = true;
        };
    }, [pairing]);

    return (
        <div className="auth-card space-card pairing-dialog" role="dialog" aria-modal="true" aria-labelledby="pairing-title">
            <h3 id="pairing-title">{t('devices.addTitle')}</h3>
            {loading && <p>{t('common.loading')}</p>}
            {error != null && <p className="auth-error">{t('devices.errorGeneric')}</p>}
            {pairing && (
                <>
                    <p className="pairing-instructions">{t('devices.addInstructions')}</p>
                    {qrDataUrl && <img className="pairing-qr" src={qrDataUrl} alt={`${t('devices.codeLabel')}: ${pairing.code}`} width={220} height={220} />}
                    <p className="pairing-code">{pairing.code}</p>
                    <p className="pairing-expiry">{t('devices.expiresAt', { time: formatDateTime(pairing.expires_at, locale) })}</p>
                </>
            )}
            <button
                type="button"
                className="auth-submit"
                onClick={() => {
                    onClose();
                    if (pairing) onPaired();
                }}
            >
                {t('devices.close')}
            </button>
        </div>
    );
}

function DevicesPanel({ spaceId, locale }: { spaceId: string; locale: string }) {
    const t = useT();
    const { data: devices, loading, error, refetch } = useDevices(spaceId);
    const [showPairing, setShowPairing] = useState(false);
    const [revokingId, setRevokingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleRevoke = async (id: string) => {
        if (!window.confirm(t('devices.revokeConfirm'))) return;
        setRevokingId(id);
        setActionError(null);
        try {
            await revokeDevice(id);
            refetch();
        } catch {
            setActionError(t('devices.errorGeneric'));
        } finally {
            setRevokingId(null);
        }
    };

    if (loading) {
        return (
            <div className="auth-card space-card">
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="auth-card space-card">
                <p className="auth-error">{t('devices.errorGeneric')}</p>
            </div>
        );
    }

    return (
        <div className="auth-card space-card devices-panel">
            <div className="space-card-title">
                <PhoneIcon />
                <h2>{t('devices.title')}</h2>
            </div>

            {actionError && <p className="auth-error">{actionError}</p>}

            {!devices || devices.length === 0 ? (
                <p className="mandate-empty">{t('devices.empty')}</p>
            ) : (
                <ul className="device-list">
                    {devices.map((device) => {
                        const healthy = isHealthy(device.etat);
                        return (
                            <li key={device.id} className="device-row">
                                <span className={`device-status ${healthy ? 'device-status-ok' : 'device-status-attention'}`}>
                                    {healthy ? <CheckCircleIcon /> : <AlertIcon />}
                                    {healthy ? t('devices.statusOk') : t('devices.statusAttention')}
                                </span>
                                <span className="device-meta">{t('devices.lastSync', { date: formatDateTime(device.derniere_synchronisation, locale) })}</span>
                                <button
                                    type="button"
                                    className="device-revoke"
                                    onClick={() => handleRevoke(device.id)}
                                    disabled={revokingId === device.id}
                                    aria-label={`${t('devices.revoke')} ${device.id}`}
                                >
                                    <TrashIcon />
                                    {t('devices.revoke')}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            {showPairing ? (
                <PairingDialog spaceId={spaceId} locale={locale} onClose={() => setShowPairing(false)} onPaired={refetch} />
            ) : (
                <button type="button" className="device-add" onClick={() => setShowPairing(true)}>
                    <PlusIcon />
                    {t('devices.add')}
                </button>
            )}
        </div>
    );
}

export { DevicesPanel };
