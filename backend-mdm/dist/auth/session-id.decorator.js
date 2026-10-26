"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionId = void 0;
const common_1 = require("@nestjs/common");
exports.SessionId = (0, common_1.createParamDecorator)((_data, context) => context.switchToHttp().getRequest()
    .sessionId);
//# sourceMappingURL=session-id.decorator.js.map