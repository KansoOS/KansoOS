import { PrismaService } from '../prisma/prisma.service';
import { SpacesService } from './spaces.service';
import { CreateMandateDto } from './dto/create-mandate.dto';
export declare class MandatesService {
    private readonly prisma;
    private readonly spacesService;
    constructor(prisma: PrismaService, spacesService: SpacesService);
    create(spaceId: string, dto: CreateMandateDto): Promise<{
        id: string;
        createdAt: Date;
        helperId: string;
        scope: string[];
        startDate: Date;
        endDate: Date;
        spaceId: string;
        revokedAt: Date | null;
        revokedById: string | null;
    }>;
    findInEffect(spaceId: string, helperId: string): Promise<{
        id: string;
        createdAt: Date;
        helperId: string;
        scope: string[];
        startDate: Date;
        endDate: Date;
        spaceId: string;
        revokedAt: Date | null;
        revokedById: string | null;
    } | null>;
}
