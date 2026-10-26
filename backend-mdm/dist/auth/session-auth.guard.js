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
exports.SessionAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const session_cookie_1 = require("./session-cookie");
const session_service_1 = require("./session.service");
let SessionAuthGuard = class SessionAuthGuard {
    sessionService;
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const rawToken = request.cookies?.[session_cookie_1.SESSION_COOKIE_NAME];
        if (!rawToken) {
            throw new common_1.UnauthorizedException('Missing session cookie.');
        }
        const session = await this.sessionService.touch(rawToken);
        if (!session) {
            throw new common_1.UnauthorizedException('Session expired or invalid.');
        }
        request.helperId = session.helperId;
        request.sessionId = session.id;
        return true;
    }
};
exports.SessionAuthGuard = SessionAuthGuard;
exports.SessionAuthGuard = SessionAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [session_service_1.SessionService])
], SessionAuthGuard);
//# sourceMappingURL=session-auth.guard.js.map