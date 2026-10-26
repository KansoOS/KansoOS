"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const me_controller_1 = require("./me.controller");
const secret_cipher_service_1 = require("./secret-cipher.service");
const session_auth_guard_1 = require("./session-auth.guard");
const session_service_1 = require("./session.service");
const totp_controller_1 = require("./totp.controller");
const totp_service_1 = require("./totp.service");
const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
const JWT_SECRET_MIN_LENGTH = 32;
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                useFactory: () => {
                    const secret = process.env.JWT_SECRET;
                    if (!secret || secret.length < JWT_SECRET_MIN_LENGTH) {
                        throw new Error(`JWT_SECRET must be set (at least ${JWT_SECRET_MIN_LENGTH} characters).`);
                    }
                    return { secret, signOptions: { expiresIn: ACCESS_TOKEN_TTL_SECONDS } };
                },
            }),
        ],
        controllers: [auth_controller_1.AuthController, me_controller_1.MeController, totp_controller_1.TotpController],
        providers: [
            auth_service_1.AuthService,
            totp_service_1.TotpService,
            secret_cipher_service_1.SecretCipherService,
            session_service_1.SessionService,
            session_auth_guard_1.SessionAuthGuard,
        ],
        exports: [session_auth_guard_1.SessionAuthGuard, session_service_1.SessionService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map