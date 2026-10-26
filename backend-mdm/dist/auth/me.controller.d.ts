import { AuthService } from './auth.service';
export declare class MeController {
    private readonly authService;
    constructor(authService: AuthService);
    getCurrentHelper(helperId: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
    }>;
}
