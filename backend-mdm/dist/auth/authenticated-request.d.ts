import type { Request } from 'express';
export type AuthenticatedRequest = Request & {
    helperId?: string;
    sessionId?: string;
};
