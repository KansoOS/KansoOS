import { PrismaService } from '../prisma/prisma.service';
import { SecretCipherService } from './secret-cipher.service';
export declare const IDLE_TTL_MS: number;
export interface ValidSession {
    id: string;
    helperId: string;
}
export declare class SessionService {
    private readonly prisma;
    private readonly cipher;
    constructor(prisma: PrismaService, cipher: SecretCipherService);
    create(helperId: string): Promise<string>;
    touch(rawToken: string): Promise<ValidSession | null>;
    destroy(sessionId: string): Promise<void>;
}
