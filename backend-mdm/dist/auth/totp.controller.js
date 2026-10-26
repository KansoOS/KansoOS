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
exports.TotpController = void 0;
const common_1 = require("@nestjs/common");
const totp_code_dto_1 = require("./dto/totp-code.dto");
const helper_id_decorator_1 = require("./helper-id.decorator");
const session_auth_guard_1 = require("./session-auth.guard");
const totp_service_1 = require("./totp.service");
let TotpController = class TotpController {
    totpService;
    constructor(totpService) {
        this.totpService = totpService;
    }
    setup(helperId) {
        return this.totpService.setup(helperId);
    }
    enable(helperId, dto) {
        return this.totpService.enable(helperId, dto.code);
    }
};
exports.TotpController = TotpController;
__decorate([
    (0, common_1.Post)('setup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, helper_id_decorator_1.HelperId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TotpController.prototype, "setup", null);
__decorate([
    (0, common_1.Post)('enable'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, helper_id_decorator_1.HelperId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, totp_code_dto_1.TotpCodeDto]),
    __metadata("design:returntype", void 0)
], TotpController.prototype, "enable", null);
exports.TotpController = TotpController = __decorate([
    (0, common_1.Controller)('auth/totp'),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    __metadata("design:paramtypes", [totp_service_1.TotpService])
], TotpController);
//# sourceMappingURL=totp.controller.js.map