import { useDevices } from '../hooks/useDevices';
import { useT } from '../i18n/useI18n';
import { isHealthy } from './deviceStatus';
import { AlertIcon, CheckCircleIcon, PhoneIcon } from './icons';

// Résumé compact de l'état des appareils pour l'onglet "Vue d'ensemble" : le
// but est de voir tout de suite s'il y a un souci, sans avoir à aller sur
// l'onglet Appareils pour le découvrir.
function DevicesSummary({ spaceId, onViewDevices }: { spaceId: string; onViewDevices: () => void }) {
    const t = useT();
    const { data: devices, loading } = useDevices(spaceId);

    if (loading || !devices) return null;

    const attentionCount = devices.filter((d) => !isHealthy(d.etat)).length;
    const okCount = devices.length - attentionCount;
    const hasAttention = attentionCount > 0;

    return (
        <button
            type="button"
            className={`devices-summary ${hasAttention ? 'devices-summary-attention' : 'devices-summary-ok'}`}
            onClick={onViewDevices}
        >
            <PhoneIcon />
            <span className="devices-summary-text">
                {hasAttention ? (
                    <>
                        <AlertIcon />
                        {t('devices.summaryAttention', { count: attentionCount })}
                    </>
                ) : (
                    <>
                        <CheckCircleIcon />
                        {t('devices.summary', { count: okCount })}
                    </>
                )}
            </span>
            <span className="devices-summary-link">{t('devices.viewAll')}</span>
        </button>
    );
}

export { DevicesSummary };
