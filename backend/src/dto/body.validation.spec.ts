import { BadRequestException } from '@nestjs/common';
import {
  parseActivityDto,
  parseActivityUpdateDto,
  parseRecordUpsertDto,
  parseUuidParam,
} from './body.validation';

const UUID = '018f1b2c-3d4e-7f80-9a1b-2c3d4e5f6071';

describe('parseActivityDto', () => {
  it('rejects an empty body instead of reaching the database', () => {
    expect(() => parseActivityDto({})).toThrow(BadRequestException);
  });

  it('rejects an amount that is not a number', () => {
    expect(() =>
      parseActivityDto({
        amount: 'abc',
        unit: 'min',
        description: 'Piano',
        representation: 'P',
      }),
    ).toThrow(BadRequestException);
  });

  it('accepts a complete activity', () => {
    const dto = parseActivityDto({
      amount: 30,
      unit: 'min',
      description: 'Piano',
      representation: 'P',
    });

    expect(dto.amount).toBe(30);
  });
});

describe('parseActivityUpdateDto', () => {
  it('rejects an update without id, which would modify an arbitrary activity', () => {
    expect(() => parseActivityUpdateDto({ description: 'Piano' })).toThrow(
      BadRequestException,
    );
  });

  it('rejects an id that is not a UUID', () => {
    expect(() => parseActivityUpdateDto({ id: 'not-a-uuid' })).toThrow(
      BadRequestException,
    );
  });

  it('keeps only the fields actually provided', () => {
    const dto = parseActivityUpdateDto({ id: UUID, description: 'Piano' });

    expect(dto).toEqual({ id: UUID, description: 'Piano' });
  });
});

describe('parseRecordUpsertDto', () => {
  it('rejects a missing date instead of silently recording today', () => {
    expect(() => parseRecordUpsertDto({ activityId: UUID })).toThrow(
      BadRequestException,
    );
  });

  it('rejects a date that is not YYYY-MM-DD', () => {
    expect(() =>
      parseRecordUpsertDto({ date: 'hier', activityId: UUID }),
    ).toThrow(BadRequestException);
  });

  it('accepts a well formed record', () => {
    const dto = parseRecordUpsertDto({ date: '2025-09-01', activityId: UUID });

    expect(dto.date).toBe('2025-09-01');
  });
});

describe('parseUuidParam', () => {
  it('rejects a route parameter that is not a UUID', () => {
    expect(() => parseUuidParam('42', 'id')).toThrow(BadRequestException);
  });
});
