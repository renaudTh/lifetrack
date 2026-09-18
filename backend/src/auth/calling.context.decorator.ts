import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { CallingContext as Context } from '../domain/calling.context';

/** Narrowed from `unknown`: Nest types getRequest() as `any`. */
function subjectOf(request: unknown): string | undefined {
  if (typeof request !== 'object' || request === null || !('user' in request)) {
    return undefined;
  }
  const user = request.user;
  if (typeof user !== 'object' || user === null || !('sub' in user)) {
    return undefined;
  }
  return typeof user.sub === 'string' ? user.sub : undefined;
}

export const CallingContext = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Context => {
    const sub = subjectOf(ctx.switchToHttp().getRequest());
    // A null userId used to reach SQL, where `= NULL` is always false: reads
    // answered 200 with an empty result.
    if (sub === undefined) {
      throw new UnauthorizedException('Token has no subject');
    }
    return { userId: sub };
  },
);
