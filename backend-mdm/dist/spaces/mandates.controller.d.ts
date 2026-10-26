import { CreateMandateDto } from './dto/create-mandate.dto';
import { MandatesService } from './mandates.service';
import { SpacesService } from './spaces.service';
export declare class MandatesController {
    private readonly mandatesService;
    private readonly spacesService;
    constructor(mandatesService: MandatesService, spacesService: SpacesService);
    create(callerHelperId: string, spaceId: string, dto: CreateMandateDto): Promise<{
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
    findInEffect(callerHelperId: string, spaceId: string): Promise<{
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
}
