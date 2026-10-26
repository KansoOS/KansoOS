"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCookieOptions = exports.SESSION_COOKIE_NAME = void 0;
exports.SESSION_COOKIE_NAME = 'kanso_session';
const sessionCookieOptions = (maxAgeMs) => ({
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    ...(maxAgeMs !== undefined ? { maxAge: maxAgeMs } : {}),
});
exports.sessionCookieOptions = sessionCookieOptions;
//# sourceMappingURL=session-cookie.js.map