import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ActivityNotFoundError, RecordNotFoundError } from './errors';
import { DomainExceptionFilter } from '../utils/domain-exception.filter';

describe('DomainExceptionFilter', () => {
  const sent: { status?: number; body?: unknown } = {};

  const host = {
    switchToHttp: () => ({
      getResponse: () => ({
        status(code: number) {
          sent.status = code;
          return this;
        },
        send(body: unknown) {
          sent.body = body;
        },
      }),
    }),
  } as unknown as ArgumentsHost;

  it('answers 404 when an activity does not exist', () => {
    new DomainExceptionFilter().catch(new ActivityNotFoundError('a1'), host);

    expect(sent.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('answers 404 when a record does not exist', () => {
    new DomainExceptionFilter().catch(new RecordNotFoundError('r1'), host);

    expect(sent.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('names the missing resource in the message', () => {
    new DomainExceptionFilter().catch(new ActivityNotFoundError('a1'), host);

    expect(sent.body).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Activity a1 not found',
    });
  });
});
