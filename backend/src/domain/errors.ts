/**
 * Domain errors. They know nothing about HTTP: DomainExceptionFilter maps them
 * to status codes.
 */
export type DomainErrorKind = 'activity-not-found' | 'record-not-found';

export abstract class DomainError extends Error {
  abstract readonly kind: DomainErrorKind;
}

export class ActivityNotFoundError extends DomainError {
  readonly kind = 'activity-not-found';

  constructor(readonly activityId: string) {
    super(`Activity ${activityId} not found`);
  }
}

export class RecordNotFoundError extends DomainError {
  readonly kind = 'record-not-found';

  constructor(readonly recordId: string) {
    super(`Record ${recordId} not found`);
  }
}
