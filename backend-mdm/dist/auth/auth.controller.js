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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const mfa_login_dto_1 = require("./dto/mfa-login.dto");
const mfa_recovery_dto_1 = require("./dto/mfa-recovery.dto");
const signup_dto_1 = require("./dto/signup.dto");
const session_id_decorator_1 = require("./session-id.decorator");
const session_cookie_1 = require("./session-cookie");
const session_auth_guard_1 = require("./session-auth.guard");
const session_service_1 = require("./session.service");
const ABSOLUTE_SESSION_TTL_MS = 12 * 60 * 60 * 1000;
let AuthController = class AuthController {
    authService;
    sessionService;
    constructor(authService, sessionService) {
        this.authService = authService;
        this.sessionService = sessionService;
    }
    async login(dto, res) {
        return this.respond(await this.authService.login(dto), res);
    }
    async loginWithTotp(dto, res) {
        return this.respond(await this.authService.loginWithTotp(dto), res);
    }
    async loginWithRecoveryCode(dto, res) {
        return this.respond(await this.authService.loginWithRecoveryCode(dto), res);
    }
    signup(dto) {
        return this.authService.signup(dto);
    }
    async logout(sessionId, res) {
        await this.sessionService.destroy(sessionId);
        res.clearCookie(session_cookie_1.SESSION_COOKIE_NAME, (0, session_cookie_1.sessionCookieOptions)());
    }
    respond(result, res) {
        if ('mfaRequired' in result) {
            return result;
        }
        const { accessToken, sessionToken } = result;
        res.cookie(session_cookie_1.SESSION_COOKIE_NAME, sessionToken, (0, session_cookie_1.sessionCookieOptions)(ABSOLUTE_SESSION_TTL_MS));
        return { accessToken };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('login/totp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mfa_login_dto_1.MfaLoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithTotp", null);
__decorate([
    (0, common_1.Post)('login/recovery'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mfa_recovery_dto_1.MfaRecoveryDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithRecoveryCode", null);
__decorate([
    (0, common_1.Post)('signup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignupDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    __param(0, (0, session_id_decorator_1.SessionId)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        session_service_1.SessionService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map