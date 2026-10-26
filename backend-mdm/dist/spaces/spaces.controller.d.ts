import { CreateSpaceDto } from './dto/create-space.dto';
import { SpacesService } from './spaces.service';
export declare class SpacesController {
    private readonly spacesService;
    constructor(spacesService: SpacesService);
    create(helperId: string, dto: CreateSpaceDto): Promise<{
        id: string;
        createdAt: Date;
        pseudonym: string;
    }>;
    findOne(helperId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        pseudonym: string;
    }>;
}
