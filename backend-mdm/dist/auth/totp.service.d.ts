import { PrismaService } from '../prisma/prisma.service';
import { SecretCipherService } from './secret-cipher.service';
export declare class TotpService {
    private readonly prisma;
    private readonly cipher;
    constructor(prisma: PrismaService, cipher: SecretCipherService);
    setup(helperId: string): Promise<{
        secret: string;
        otpauthUri: string;
    }>;
    enable(helperId: string, code: string): Promise<{
        recoveryCodes: string[];
    }>;
    verifyLoginCode(helperId: string, code: string): Promise<void>;
    verifyRecoveryCode(helperId: string, recoveryCode: string): Promise<void>;
    private reserveAttempt;
    private rejectMfa;
    private matchStep;
    private buildTotp;
    private generateRecoveryCodes;
    private findHelper;
    private findTotpEnabledHelper;
}
