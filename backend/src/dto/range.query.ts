import { BadRequestException } from '@nestjs/common';
import { DateSampling, DjsDate } from '@lifetrack/lib';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const DATE_FORMAT = 'YYYY-MM-DD';
const SAMPLINGS = ['day', 'week', 'month', 'year'] as const;

export function parseDateParam(
  value: string | undefined,
  fallback: string,
): DjsDate {
  const parsed = dayjs(value ?? fallback, DATE_FORMAT, true);
  if (!parsed.isValid()) {
    throw new BadRequestException(
      `Invalid date "${value}", expected ${DATE_FORMAT}`,
    );
  }
  return parsed;
}

export function parseSamplingParam(value: string | undefined): DateSampling {
  const sampling = SAMPLINGS.find((candidate) => candidate === value);
  // Sans ce garde, une valeur inconnue fait boucler generateSampleKeys indefiniment.
  if (value !== undefined && sampling === undefined) {
    throw new BadRequestException(
      `Invalid sampling "${value}", expected one of ${SAMPLINGS.join(', ')}`,
    );
  }
  return sampling ?? 'month';
}

export function assertOrderedRange(start: DjsDate, end: DjsDate): void {
  if (end.isBefore(start)) {
    throw new BadRequestException('end must not be before start');
  }
}
