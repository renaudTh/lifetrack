import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { CallingContext as Context } from '../domain/calling.context';

/** Narrowing depuis `unknown` : getRequest() est typé `any` par Nest. */
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
    // Un userId null traversait jusqu'au SQL, ou `= NULL` est toujours faux :
    // les lectures renvoyaient 200 avec un resultat vide.
    if (sub === undefined) {
      throw new UnauthorizedException('Token has no subject');
    }
    return { userId: sub };
  },
);
