"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperId = void 0;
const common_1 = require("@nestjs/common");
exports.HelperId = (0, common_1.createParamDecorator)((_data, context) => context.switchToHttp().getRequest()
    .helperId);
//# sourceMappingURL=helper-id.decorator.js.map