// Le backend ne renvoie que "actif"/autre chose pour l'instant, donc tout ce
// qui n'est pas explicitement "actif" est traité comme à surveiller, par
// prudence, plutôt que de supposer un statut optimiste par défaut.
export const isHealthy = (etat: string): boolean => etat === 'actif';
