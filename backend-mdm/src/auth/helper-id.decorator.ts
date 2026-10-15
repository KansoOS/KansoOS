import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import type {AuthenticatedRequest} from './authenticated-request';

// Only valid on routes protected by JwtAuthGuard or SessionAuthGuard, which set helperId.
export const HelperId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string =>
    context.switchToHttp().getRequest<AuthenticatedRequest>()
      .helperId as string,
);
