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
exports.SecretCipherService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const KEY_BYTES = 32;
const IV_BYTES = 12;
const FORMAT_VERSION = 'v1';
const deriveKey = (masterKey, purpose) => Buffer.from((0, node_crypto_1.hkdfSync)('sha256', masterKey, Buffer.alloc(0), purpose, KEY_BYTES));
let SecretCipherService = class SecretCipherService {
    encryptionKey;
    recoveryCodeHmacKey;
    sessionTokenHmacKey;
    constructor() {
        const masterKey = Buffer.from(process.env.TOTP_ENCRYPTION_KEY ?? '', 'base64');
        if (masterKey.length !== KEY_BYTES) {
            throw new Error('TOTP_ENCRYPTION_KEY must be 32 bytes encoded in base64 (openssl rand -base64 32).');
        }
        this.encryptionKey = deriveKey(masterKey, 'totp-secret-encryption');
        this.recoveryCodeHmacKey = deriveKey(masterKey, 'recovery-code-hmac');
        this.sessionTokenHmacKey = deriveKey(masterKey, 'session-token-hmac');
    }
    encrypt(plaintext) {
        const iv = (0, node_crypto_1.randomBytes)(IV_BYTES);
        const cipher = (0, node_crypto_1.createCipheriv)('aes-256-gcm', this.encryptionKey, iv);
        const ciphertext = Buffer.concat([
            cipher.update(plaintext, 'utf8'),
            cipher.final(),
        ]);
        return [
            FORMAT_VERSION,
            iv.toString('base64'),
            cipher.getAuthTag().toString('base64'),
            ciphertext.toString('base64'),
        ].join(':');
    }
    decrypt(payload) {
        const [version, iv, authTag, ciphertext] = payload.split(':');
        if (version !== FORMAT_VERSION || !iv || !authTag || !ciphertext) {
            throw new Error('Unsupported encrypted secret format.');
        }
        const decipher = (0, node_crypto_1.createDecipheriv)('aes-256-gcm', this.encryptionKey, Buffer.from(iv, 'base64'));
        decipher.setAuthTag(Buffer.from(authTag, 'base64'));
        return Buffer.concat([
            decipher.update(Buffer.from(ciphertext, 'base64')),
            decipher.final(),
        ]).toString('utf8');
    }
    hashRecoveryCode(normalizedCode) {
        return (0, node_crypto_1.createHmac)('sha256', this.recoveryCodeHmacKey)
            .update(normalizedCode)
            .digest('hex');
    }
    hashSessionToken(rawToken) {
        return (0, node_crypto_1.createHmac)('sha256', this.sessionTokenHmacKey)
            .update(rawToken)
            .digest('hex');
    }
};
exports.SecretCipherService = SecretCipherService;
exports.SecretCipherService = SecretCipherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SecretCipherService);
//# sourceMappingURL=secret-cipher.service.js.map