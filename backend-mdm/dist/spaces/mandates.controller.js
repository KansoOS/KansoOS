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
exports.MandatesController = void 0;
const common_1 = require("@nestjs/common");
const helper_id_decorator_1 = require("../auth/helper-id.decorator");
const session_auth_guard_1 = require("../auth/session-auth.guard");
const create_mandate_dto_1 = require("./dto/create-mandate.dto");
const mandates_service_1 = require("./mandates.service");
const spaces_service_1 = require("./spaces.service");
let MandatesController = class MandatesController {
    mandatesService;
    spacesService;
    constructor(mandatesService, spacesService) {
        this.mandatesService = mandatesService;
        this.spacesService = spacesService;
    }
    async create(callerHelperId, spaceId, dto) {
        if (!(await this.spacesService.isMember(callerHelperId, spaceId))) {
            throw new common_1.NotFoundException('Space not found.');
        }
        return this.mandatesService.create(spaceId, dto);
    }
    async findInEffect(callerHelperId, spaceId) {
        const mandate = await this.mandatesService.findInEffect(spaceId, callerHelperId);
        if (!mandate) {
            throw new common_1.NotFoundException('No mandate in effect.');
        }
        return mandate;
    }
};
exports.MandatesController = MandatesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, helper_id_decorator_1.HelperId)()),
    __param(1, (0, common_1.Param)('spaceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_mandate_dto_1.CreateMandateDto]),
    __metadata("design:returntype", Promise)
], MandatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, helper_id_decorator_1.HelperId)()),
    __param(1, (0, common_1.Param)('spaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MandatesController.prototype, "findInEffect", null);
exports.MandatesController = MandatesController = __decorate([
    (0, common_1.Controller)('spaces/:spaceId/mandate'),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    __metadata("design:paramtypes", [mandates_service_1.MandatesService,
        spaces_service_1.SpacesService])
], MandatesController);
//# sourceMappingURL=mandates.controller.js.map