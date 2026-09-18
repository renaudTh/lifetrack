import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DomainError, DomainErrorKind } from '../domain/errors';

const STATUS: Record<DomainErrorKind, HttpStatus> = {
  'activity-not-found': HttpStatus.NOT_FOUND,
  'record-not-found': HttpStatus.NOT_FOUND,
};

/** The only place where a domain error becomes an HTTP status. */
@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter<DomainError> {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const status = STATUS[exception.kind];
    host
      .switchToHttp()
      .getResponse<FastifyReply>()
      .status(status)
      .send({ statusCode: status, message: exception.message });
  }
}
