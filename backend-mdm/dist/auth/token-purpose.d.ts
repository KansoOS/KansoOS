export declare const TokenPurpose: {
    readonly ACCESS: "access";
    readonly MFA: "mfa";
};
export interface TokenPayload {
    sub: string;
    purpose?: string;
}
