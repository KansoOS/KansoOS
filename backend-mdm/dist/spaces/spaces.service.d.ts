import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
export declare class SpacesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(helperId: string, dto: CreateSpaceDto): Promise<{
        id: string;
        createdAt: Date;
        pseudonym: string;
    }>;
    findForHelper(helperId: string, spaceId: string): Promise<{
        id: string;
        createdAt: Date;
        pseudonym: string;
    } | null>;
    isMember(helperId: string, spaceId: string): Promise<boolean>;
    ensureMember(helperId: string, spaceId: string): Promise<void>;
}
