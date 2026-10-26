import { TotpCodeDto } from './dto/totp-code.dto';
import { TotpService } from './totp.service';
export declare class TotpController {
    private readonly totpService;
    constructor(totpService: TotpService);
    setup(helperId: string): Promise<{
        secret: string;
        otpauthUri: string;
    }>;
    enable(helperId: string, dto: TotpCodeDto): Promise<{
        recoveryCodes: string[];
    }>;
}
