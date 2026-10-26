import type { CookieOptions } from 'express';
export declare const SESSION_COOKIE_NAME = "kanso_session";
export declare const sessionCookieOptions: (maxAgeMs?: number) => CookieOptions;
