import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { MfaLoginDto } from './dto/mfa-login.dto';
import { MfaRecoveryDto } from './dto/mfa-recovery.dto';
import { SignupDto } from './dto/signup.dto';
import { SessionService } from './session.service';
import { TotpService } from './totp.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly totpService;
    private readonly sessionService;
    private readonly dummyHash;
    constructor(prisma: PrismaService, jwtService: JwtService, totpService: TotpService, sessionService: SessionService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        sessionToken: string;
    } | {
        mfaRequired: true;
        mfaToken: string;
    }>;
    loginWithTotp(dto: MfaLoginDto): Promise<{
        accessToken: string;
        sessionToken: string;
    }>;
    loginWithRecoveryCode(dto: MfaRecoveryDto): Promise<{
        accessToken: string;
        sessionToken: string;
    }>;
    getCurrentHelper(helperId: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
    }>;
    private issueTokens;
    private verifyMfaToken;
    signup(dto: SignupDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
    }>;
}
