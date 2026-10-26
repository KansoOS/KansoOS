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
exports.MandatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const spaces_service_1 = require("./spaces.service");
const MANDATE_SELECT = {
    id: true,
    spaceId: true,
    helperId: true,
    scope: true,
    startDate: true,
    endDate: true,
    revokedAt: true,
    revokedById: true,
    createdAt: true,
};
let MandatesService = class MandatesService {
    prisma;
    spacesService;
    constructor(prisma, spacesService) {
        this.prisma = prisma;
        this.spacesService = spacesService;
    }
    async create(spaceId, dto) {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);
        if (endDate <= startDate) {
            throw new common_1.BadRequestException('endDate must be after startDate.');
        }
        await this.spacesService.ensureMember(dto.helperId, spaceId);
        return this.prisma.mandate.create({
            data: {
                spaceId,
                helperId: dto.helperId,
                scope: dto.scope,
                startDate,
                endDate,
            },
            select: MANDATE_SELECT,
        });
    }
    async findInEffect(spaceId, helperId) {
        const now = new Date();
        return this.prisma.mandate.findFirst({
            where: {
                spaceId,
                helperId,
                revokedAt: null,
                startDate: { lte: now },
                endDate: { gte: now },
            },
            orderBy: { startDate: 'desc' },
            select: MANDATE_SELECT,
        });
    }
};
exports.MandatesService = MandatesService;
exports.MandatesService = MandatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        spaces_service_1.SpacesService])
], MandatesService);
//# sourceMappingURL=mandates.service.js.map