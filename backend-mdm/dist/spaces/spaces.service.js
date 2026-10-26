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
exports.SpacesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const SPACE_SELECT = { id: true, pseudonym: true, createdAt: true };
let SpacesService = class SpacesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(helperId, dto) {
        return this.prisma.space.create({
            data: {
                pseudonym: dto.pseudonym,
                memberships: { create: { helperId } },
            },
            select: SPACE_SELECT,
        });
    }
    async findForHelper(helperId, spaceId) {
        return this.prisma.space.findFirst({
            where: { id: spaceId, memberships: { some: { helperId } } },
            select: SPACE_SELECT,
        });
    }
    async isMember(helperId, spaceId) {
        const membership = await this.prisma.spaceMembership.findUnique({
            where: { spaceId_helperId: { spaceId, helperId } },
            select: { id: true },
        });
        return membership !== null;
    }
    async ensureMember(helperId, spaceId) {
        await this.prisma.spaceMembership.upsert({
            where: { spaceId_helperId: { spaceId, helperId } },
            create: { spaceId, helperId },
            update: {},
        });
    }
};
exports.SpacesService = SpacesService;
exports.SpacesService = SpacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpacesService);
//# sourceMappingURL=spaces.service.js.map