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
exports.AuthService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const session_service_1 = require("./session.service");
const token_purpose_1 = require("./token-purpose");
const totp_service_1 = require("./totp.service");
const tslog_1 = require("tslog");
const logger = new tslog_1.Logger();
const PRISMA_UNIQUE_CONSTRAINT_ERROR_CODE = 'P2002';
const MFA_TOKEN_TTL_SECONDS = 5 * 60;
let AuthService = class AuthService {
    prisma;
    jwtService;
    totpService;
    sessionService;
    dummyHash = argon2.hash((0, node_crypto_1.randomBytes)(16).toString('hex'), {
        type: argon2.argon2id,
    });
    constructor(prisma, jwtService, totpService, sessionService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.totpService = totpService;
        this.sessionService = sessionService;
    }
    async login(dto) {
        const helper = await this.prisma.helper.findUnique({
            where: { email: dto.email },
        });
        const passwordHash = helper?.passwordHash ?? (await this.dummyHash);
        const isPasswordValid = await argon2.verify(passwordHash, dto.password);
        if (!helper || !isPasswordValid) {
            logger.warn('Failed login attempt: invalid credentials');
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        if (helper.totpEnabled) {
            const mfaToken = await this.jwtService.signAsync({ sub: helper.id, purpose: token_purpose_1.TokenPurpose.MFA }, { expiresIn: MFA_TOKEN_TTL_SECONDS });
            logger.info('MFA challenge issued for helper: ' + helper.id);
            return { mfaRequired: true, mfaToken };
        }
        return this.issueTokens(helper.id);
    }
    async loginWithTotp(dto) {
        const helperId = await this.verifyMfaToken(dto.mfaToken);
        await this.totpService.verifyLoginCode(helperId, dto.code);
        return this.issueTokens(helperId);
    }
    async loginWithRecoveryCode(dto) {
        const helperId = await this.verifyMfaToken(dto.mfaToken);
        await this.totpService.verifyRecoveryCode(helperId, dto.recoveryCode);
        return this.issueTokens(helperId);
    }
    async getCurrentHelper(helperId) {
        const helper = await this.prisma.helper.findUnique({
            where: { id: helperId },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
        if (!helper) {
            throw new common_1.UnauthorizedException('Unknown account.');
        }
        return helper;
    }
    async issueTokens(helperId) {
        const accessToken = await this.jwtService.signAsync({
            sub: helperId,
            purpose: token_purpose_1.TokenPurpose.ACCESS,
        });
        const sessionToken = await this.sessionService.create(helperId);
        logger.info('Helper logged in: ' + helperId);
        return { accessToken, sessionToken };
    }
    async verifyMfaToken(mfaToken) {
        const payload = await this.jwtService
            .verifyAsync(mfaToken, { algorithms: ['HS256'] })
            .catch(() => null);
        if (payload?.purpose !== token_purpose_1.TokenPurpose.MFA) {
            throw new common_1.UnauthorizedException('Invalid or expired MFA token.');
        }
        return payload.sub;
    }
    async signup(dto) {
        const passwordHash = await argon2.hash(dto.password, {
            type: argon2.argon2id,
        });
        try {
            const helper = await this.prisma.helper.create({
                data: {
                    email: dto.email,
                    passwordHash,
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                },
            });
            logger.info('Creating a new helper with email: ' + dto.email);
            return helper;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR_CODE) {
                logger.error('Conflict error while creating a new helper with email: ' + dto.email);
                throw new common_1.ConflictException('An account already exists with this email.');
            }
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        totp_service_1.TotpService,
        session_service_1.SessionService])
], AuthService);
//# sourceMappingURL=auth.service.js.map