"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = exports.IDLE_TTL_MS = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const tslog_1 = require("tslog");
const prisma_service_1 = require("../prisma/prisma.service");
const secret_cipher_service_1 = require("./secret-cipher.service");
const logger = new tslog_1.Logger();
const SESSION_TOKEN_BYTES = 32;
const ABSOLUTE_TTL_MS = 12 * 60 * 60 * 1000;
exports.IDLE_TTL_MS = 30 * 60 * 1000;
let SessionService = class SessionService {
    prisma;
    cipher;
    constructor(prisma, cipher) {
        this.prisma = prisma;
        this.cipher = cipher;
    }
    async create(helperId) {
        const rawToken = (0, node_crypto_1.randomBytes)(SESSION_TOKEN_BYTES).toString('base64url');
        const now = new Date();
        await this.prisma.session.create({
            data: {
                helperId,
                tokenHash: this.cipher.hashSessionToken(rawToken),
                expiresAt: new Date(now.getTime() + ABSOLUTE_TTL_MS),
                lastActivityAt: now,
            },
        });
        return rawToken;
    }
    async touch(rawToken) {
        const tokenHash = this.cipher.hashSessionToken(rawToken);
        const session = await this.prisma.session.findUnique({
            where: { tokenHash },
        });
        if (!session) {
            return null;
        }
        const now = new Date();
        const idleDeadline = session.lastActivityAt.getTime() + exports.IDLE_TTL_MS;
        if (now.getTime() > session.expiresAt.getTime() ||
            now.getTime() > idleDeadline) {
            await this.prisma.session
                .delete({ where: { id: session.id } })
                .catch(() => undefined);
            return null;
        }
        await this.prisma.session.update({
            where: { id: session.id },
            data: { lastActivityAt: now },
        });
        return { id: session.id, helperId: session.helperId };
    }
    async destroy(sessionId) {
        await this.prisma.session
            .delete({ where: { id: sessionId } })
            .catch(() => undefined);
        logger.info('Session destroyed: ' + sessionId);
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        secret_cipher_service_1.SecretCipherService])
], SessionService);
//# sourceMappingURL=session.service.js.map