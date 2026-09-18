import { BadRequestException } from '@nestjs/common';
import { Activity } from '@lifetrack/lib';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ActivityDto, ActivityUpdateDto } from './activity.dto';
import { RecordUpsertDto } from './record.dto';

dayjs.extend(customParseFormat);

const DATE_FORMAT = 'YYYY-MM-DD';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function asRecord(body: unknown, what: string): Record<string, unknown> {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new BadRequestException(`${what} must be an object`);
  }
  return { ...body };
}

function requireString(value: unknown, field: string, what: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new BadRequestException(
      `${what}.${field} must be a non-empty string`,
    );
  }
  return value;
}

function requireNumber(value: unknown, field: string, what: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new BadRequestException(`${what}.${field} must be a finite number`);
  }
  return value;
}

export function parseUuidParam(value: string, field: string): string {
  if (!UUID.test(value)) {
    throw new BadRequestException(`${field} must be a UUID`);
  }
  return value;
}

export function parseDateField(
  value: unknown,
  field: string,
  what: string,
): string {
  const raw = requireString(value, field, what);
  if (!dayjs(raw, DATE_FORMAT, true).isValid()) {
    throw new BadRequestException(`${what}.${field} must match ${DATE_FORMAT}`);
  }
  return raw;
}

export function parseActivityDto(body: unknown): ActivityDto {
  const raw = asRecord(body, 'activity');
  return {
    amount: requireNumber(raw['amount'], 'amount', 'activity'),
    unit: requireString(raw['unit'], 'unit', 'activity'),
    description: requireString(raw['description'], 'description', 'activity'),
    representation: requireString(
      raw['representation'],
      'representation',
      'activity',
    ),
  };
}

export function parseActivityUpdateDto(body: unknown): ActivityUpdateDto {
  const raw = asRecord(body, 'activity');
  // Without this id TypeORM drops the `where` clause and returns an arbitrary
  // activity, which the caller then overwrites.
  const id = parseUuidParam(
    requireString(raw['id'], 'id', 'activity'),
    'activity.id',
  );

  const patch: Partial<Activity> = {};
  if (raw['amount'] !== undefined) {
    patch.amount = requireNumber(raw['amount'], 'amount', 'activity');
  }
  if (raw['unit'] !== undefined) {
    patch.unit = requireString(raw['unit'], 'unit', 'activity');
  }
  if (raw['description'] !== undefined) {
    patch.description = requireString(
      raw['description'],
      'description',
      'activity',
    );
  }
  if (raw['representation'] !== undefined) {
    patch.representation = requireString(
      raw['representation'],
      'representation',
      'activity',
    );
  }
  return { ...patch, id };
}

export function parseRecordUpsertDto(body: unknown): RecordUpsertDto {
  const raw = asRecord(body, 'record');
  return {
    date: parseDateField(raw['date'], 'date', 'record'),
    activityId: parseUuidParam(
      requireString(raw['activityId'], 'activityId', 'record'),
      'record.activityId',
    ),
  };
}
