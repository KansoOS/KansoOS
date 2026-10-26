export declare class SecretCipherService {
    private readonly encryptionKey;
    private readonly recoveryCodeHmacKey;
    private readonly sessionTokenHmacKey;
    constructor();
    encrypt(plaintext: string): string;
    decrypt(payload: string): string;
    hashRecoveryCode(normalizedCode: string): string;
    hashSessionToken(rawToken: string): string;
}
