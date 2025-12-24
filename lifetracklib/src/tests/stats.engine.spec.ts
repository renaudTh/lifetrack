import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { generateSampleKeys, StatsEngine } from '../stats.engine';
import { test_history } from './data';
import { describe, it, expect } from 'vitest';
dayjs.extend(weekOfYear);

describe('generateSampleKeys', () => {
  it('should generate daily sample keys', () => {
    const start = dayjs('2025-09-01');
    const end = dayjs('2025-09-10');
    const keys = generateSampleKeys(start, end, 'day');
    expect(keys).toEqual(
      new Set([
        '2025-09-01',
        '2025-09-02',
        '2025-09-03',
        '2025-09-04',
        '2025-09-05',
        '2025-09-06',
        '2025-09-07',
        '2025-09-08',
        '2025-09-09',
        '2025-09-10',
      ]),
    );
  });

  it('should generate weekly sample keys', () => {
    const keys = generateSampleKeys(
      dayjs('2025-01-01'),
      dayjs('2025-02-01'),
      'week',
    );
    expect(keys).toEqual(
      new Set(['2025-01', '2025-02', '2025-03', '2025-04', '2025-05']),
    );
  });

  it('should generate monthly sample keys', () => {
    const keys = generateSampleKeys(
      dayjs('2025-01-01'),
      dayjs('2025-05-01'),
      'month',
    );
    expect(keys).toEqual(
      new Set(['2025-01', '2025-02', '2025-03', '2025-04', '2025-05']),
    );
  });

  it('should generate yearly sample keys', () => {
    const keys = generateSampleKeys(
      dayjs('2025-01-01'),
      dayjs('2026-02-01'),
      'year',
    );
    expect(keys).toEqual(new Set(['2025', '2026']));
  });

  it('should throw if end is before start', () => {
    expect(() =>
      generateSampleKeys(dayjs('2025-05-01'), dayjs('2025-01-01'), 'month'),
    ).toThrowError();
  });
});

describe('StatsEngine', () => {
  it('should group', () => {
    const engine = new StatsEngine(
      dayjs('2025-09-01'),
      dayjs('2025-09-30'),
      test_history,
    );
    engine.computeStats();
  });
});
