"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotpService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const OTPAuth = __importStar(require("otpauth"));
const tslog_1 = require("tslog");
const prisma_service_1 = require("../prisma/prisma.service");
const secret_cipher_service_1 = require("./secret-cipher.service");
const logger = new tslog_1.Logger();
const ISSUER = 'Kanso';
const TOTP_PERIOD_SECONDS = 30;
const TOTP_WINDOW = 1;
const RECOVERY_CODE_COUNT = 10;
const MAX_MFA_ATTEMPTS = 5;
const MFA_LOCK_MS = 15 * 60 * 1000;
const normalizeRecoveryCode = (code) => code.replace(/-/g, '').toLowerCase();
let TotpService = class TotpService {
    prisma;
    cipher;
    constructor(prisma, cipher) {
        this.prisma = prisma;
        this.cipher = cipher;
    }
    async setup(helperId) {
        const helper = await this.findHelper(helperId);
        if (helper.totpEnabled) {
            throw new common_1.ConflictException('TOTP is already enabled.');
        }
        const secret = new OTPAuth.Secret({ size: 20 });
        await this.prisma.helper.update({
            where: { id: helperId },
            data: {
                totpSecretEncrypted: this.cipher.encrypt(secret.base32),
                totpLastUsedStep: null,
            },
        });
        return {
            secret: secret.base32,
            otpauthUri: this.buildTotp(secret, helper.email).toString(),
        };
    }
    async enable(helperId, code) {
        const helper = await this.findHelper(helperId);
        if (helper.totpEnabled) {
            throw new common_1.ConflictException('TOTP is already enabled.');
        }
        if (!helper.totpSecretEncrypted) {
            throw new common_1.BadRequestException('Call /auth/totp/setup first.');
        }
        const step = this.matchStep(helper.totpSecretEncrypted, code);
        if (step === null) {
            throw new common_1.UnauthorizedException('Invalid code.');
        }
        const recoveryCodes = this.generateRecoveryCodes();
        await this.prisma.$transaction(async (tx) => {
            const { count } = await tx.helper.updateMany({
                where: {
                    id: helperId,
                    totpEnabled: false,
                    totpSecretEncrypted: helper.totpSecretEncrypted,
                },
                data: {
                    totpEnabled: true,
                    totpLastUsedStep: step,
                    mfaFailedAttempts: 0,
                    mfaLockedUntil: null,
                },
            });
            if (count !== 1) {
                throw new common_1.ConflictException('TOTP setup changed, please retry.');
            }
            await tx.recoveryCode.deleteMany({ where: { helperId } });
            await tx.recoveryCode.createMany({
                data: recoveryCodes.map(recoveryCode => ({
                    helperId,
                    codeHash: this.cipher.hashRecoveryCode(normalizeRecoveryCode(recoveryCode)),
                })),
            });
        });
        logger.info('TOTP enabled for helper: ' + helperId);
        return { recoveryCodes };
    }
    async verifyLoginCode(helperId, code) {
        const helper = await this.findTotpEnabledHelper(helperId);
        await this.reserveAttempt(helperId);
        const step = this.matchStep(helper.totpSecretEncrypted, code);
        if (step === null) {
            this.rejectMfa(helperId);
        }
        const { count } = await this.prisma.helper.updateMany({
            where: {
                id: helperId,
                OR: [{ totpLastUsedStep: null }, { totpLastUsedStep: { lt: step } }],
            },
            data: {
                totpLastUsedStep: step,
                mfaFailedAttempts: 0,
                mfaLockedUntil: null,
            },
        });
        if (count !== 1) {
            this.rejectMfa(helperId);
        }
    }
    async verifyRecoveryCode(helperId, recoveryCode) {
        await this.findTotpEnabledHelper(helperId);
        await this.reserveAttempt(helperId);
        const { count } = await this.prisma.recoveryCode.updateMany({
            where: {
                helperId,
                codeHash: this.cipher.hashRecoveryCode(normalizeRecoveryCode(recoveryCode)),
                usedAt: null,
            },
            data: { usedAt: new Date() },
        });
        if (count !== 1) {
            this.rejectMfa(helperId);
        }
        await this.prisma.helper.update({
            where: { id: helperId },
            data: { mfaFailedAttempts: 0, mfaLockedUntil: null },
        });
        logger.warn('Recovery code used for helper: ' + helperId);
    }
    async reserveAttempt(helperId) {
        const now = new Date();
        await this.prisma.helper.updateMany({
            where: { id: helperId, mfaLockedUntil: { lte: now } },
            data: { mfaLockedUntil: null, mfaFailedAttempts: 0 },
        });
        const { mfaFailedAttempts, mfaLockedUntil } = await this.prisma.helper.update({
            where: { id: helperId },
            data: { mfaFailedAttempts: { increment: 1 } },
            select: { mfaFailedAttempts: true, mfaLockedUntil: true },
        });
        if (mfaLockedUntil === null && mfaFailedAttempts > MAX_MFA_ATTEMPTS) {
            await this.prisma.helper.updateMany({
                where: { id: helperId, mfaLockedUntil: null },
                data: { mfaLockedUntil: new Date(now.getTime() + MFA_LOCK_MS) },
            });
            logger.warn('MFA locked after too many attempts for helper: ' + helperId);
        }
        if (mfaLockedUntil !== null || mfaFailedAttempts > MAX_MFA_ATTEMPTS) {
            throw new common_1.HttpException('Too many attempts. Try again later.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    rejectMfa(helperId) {
        logger.warn('Failed MFA verification for helper: ' + helperId);
        throw new common_1.UnauthorizedException('Invalid code.');
    }
    matchStep(encryptedSecret, code) {
        const secret = OTPAuth.Secret.fromBase32(this.cipher.decrypt(encryptedSecret));
        const timestamp = Date.now();
        const delta = this.buildTotp(secret).validate({
            token: code,
            timestamp,
            window: TOTP_WINDOW,
        });
        if (delta === null) {
            return null;
        }
        return (OTPAuth.TOTP.counter({ period: TOTP_PERIOD_SECONDS, timestamp }) + delta);
    }
    buildTotp(secret, label = '') {
        return new OTPAuth.TOTP({
            issuer: ISSUER,
            label,
            secret,
            algorithm: 'SHA1',
            digits: 6,
            period: TOTP_PERIOD_SECONDS,
        });
    }
    generateRecoveryCodes() {
        return Array.from({ length: RECOVERY_CODE_COUNT }, () => (0, node_crypto_1.randomBytes)(8)
            .toString('hex')
            .replace(/(.{4})(?=.)/g, '$1-'));
    }
    async findHelper(helperId) {
        const helper = await this.prisma.helper.findUnique({
            where: { id: helperId },
        });
        if (!helper) {
            throw new common_1.UnauthorizedException('Unknown account.');
        }
        return helper;
    }
    async findTotpEnabledHelper(helperId) {
        const helper = await this.findHelper(helperId);
        if (!helper.totpEnabled || !helper.totpSecretEncrypted) {
            throw new common_1.UnauthorizedException('Invalid MFA session.');
        }
        return { ...helper, totpSecretEncrypted: helper.totpSecretEncrypted };
    }
};
exports.TotpService = TotpService;
exports.TotpService = TotpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        secret_cipher_service_1.SecretCipherService])
], TotpService);
//# sourceMappingURL=totp.service.js.map