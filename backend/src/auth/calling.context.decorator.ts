import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CallingContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return { userId: request.user?.sub ?? null };
  },
);
