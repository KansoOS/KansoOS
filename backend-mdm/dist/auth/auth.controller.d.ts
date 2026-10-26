import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { MfaLoginDto } from './dto/mfa-login.dto';
import { MfaRecoveryDto } from './dto/mfa-recovery.dto';
import { SignupDto } from './dto/signup.dto';
import { SessionService } from './session.service';
export declare class AuthController {
    private readonly authService;
    private readonly sessionService;
    constructor(authService: AuthService, sessionService: SessionService);
    login(dto: LoginDto, res: Response): Promise<{
        mfaRequired: true;
        mfaToken: string;
    } | {
        accessToken: string;
    }>;
    loginWithTotp(dto: MfaLoginDto, res: Response): Promise<{
        mfaRequired: true;
        mfaToken: string;
    } | {
        accessToken: string;
    }>;
    loginWithRecoveryCode(dto: MfaRecoveryDto, res: Response): Promise<{
        mfaRequired: true;
        mfaToken: string;
    } | {
        accessToken: string;
    }>;
    signup(dto: SignupDto): Promise<{
        email: string;
        id: string;
        createdAt: Date;
    }>;
    logout(sessionId: string, res: Response): Promise<void>;
    private respond;
}
