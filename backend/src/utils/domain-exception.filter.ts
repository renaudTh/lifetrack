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

/** Seul endroit ou une erreur du domaine devient un statut HTTP. */
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
