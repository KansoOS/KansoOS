import { ApiError } from '../api';
import { useMandate, useSpace } from '../hooks/useSpace';
import { useT } from '../i18n/useI18n';

// On formate explicitement en UTC parce que ce sont des dates de validité,
// un jour calendaire, pas un instant précis, et sans ça l'affichage décale
// d'un jour pour quiconque est dans un fuseau derrière UTC, donc toutes les Amériques.
function formatDate(iso: string, locale: string): string {
    return new Date(iso).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    });
}

function SpaceMandateInfo({ spaceId, locale }: { spaceId: string; locale: string }) {
    const t = useT();
    const { data: space, loading: spaceLoading, error: spaceError } = useSpace(spaceId);
    const { data: mandate, loading: mandateLoading, error: mandateError } = useMandate(spaceId);

    if (spaceLoading || mandateLoading) {
        return (
            <div className="auth-card space-card">
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    if (spaceError || !space) {
        return (
            <div className="auth-card space-card">
                <p className="auth-error">{t('space.notFound')}</p>
            </div>
        );
    }

    // Une 404 ici veut juste dire qu'il n'y a pas de mandat en vigueur pour cet
    // espace, c'est un état normal, pas une erreur à afficher en rouge.
    const hasNoMandate = mandateError instanceof ApiError && mandateError.status === 404;

    return (
        <div className="auth-card space-card">
            <h2>{space.pseudonym}</h2>
            <p className="space-meta">{t('space.createdAt', { date: formatDate(space.createdAt, locale) })}</p>

            <h3>{t('space.mandate.title')}</h3>
            {hasNoMandate || !mandate ? (
                <p className="mandate-empty">{t('space.mandate.none')}</p>
            ) : (
                <>
                    <p className="mandate-period">
                        {t('space.mandate.period', {
                            start: formatDate(mandate.startDate, locale),
                            end: formatDate(mandate.endDate, locale),
                        })}
                    </p>
                    <p className="scope-title">{t('space.mandate.scopeTitle')}</p>
                    <ul className="scope-list">
                        {mandate.scope.map((permission) => (
                            <li key={permission} className="scope-badge">
                                {permission}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export { SpaceMandateInfo };
