import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { generateSampleKeys, getSampleKey, StatsEngine } from '../stats.engine';
import { testActivities } from './data';
import { Activity, ActivityRecord } from '../models/activity.model';
import { DateSampling } from '../models/date.model';
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
    // A week is identified by the day it starts on: no collision across years,
    // and no dayjs plugin required.
    expect(keys).toEqual(
      new Set([
        '2024-12-29',
        '2025-01-05',
        '2025-01-12',
        '2025-01-19',
        '2025-01-26',
      ]),
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

  it('separates weeks that share a week number across two years', () => {
    expect(getSampleKey(dayjs('2025-12-29'), 'week')).not.toBe(
      getSampleKey(dayjs('2025-01-02'), 'week'),
    );
  });

  it('gives one key to a week spanning two years', () => {
    expect(getSampleKey(dayjs('2025-12-29'), 'week')).toBe(
      getSampleKey(dayjs('2026-01-01'), 'week'),
    );
  });

  it('rejects an unknown sampling instead of looping forever', () => {
    expect(() =>
      generateSampleKeys(
        dayjs('2025-01-01'),
        dayjs('2025-05-01'),
        'decade' as DateSampling,
      ),
    ).toThrowError();
  });

  it('should throw if end is before start', () => {
    expect(() =>
      generateSampleKeys(dayjs('2025-05-01'), dayjs('2025-01-01'), 'month'),
    ).toThrowError();
  });
});

describe('StatsEngine', () => {
  const piano = testActivities[0];
  const bike = testActivities[1];

  const recordOf = (
    activity: Activity,
    date: string,
    quantity: number,
  ): ActivityRecord => ({
    id: `${activity.id}-${date}`,
    activity,
    date: dayjs(date),
    number: quantity,
  });

  const statsOf = (records: ActivityRecord[], sampling: DateSampling = 'day') =>
    new StatsEngine(
      dayjs('2025-09-01'),
      dayjs('2025-09-30'),
      records,
    ).computeStats(sampling).stats;

  it('counts every record of an activity in its cumulated sum', () => {
    const stats = statsOf([
      recordOf(piano, '2025-09-01', 2),
      recordOf(piano, '2025-09-02', 3),
      recordOf(piano, '2025-09-03', 5),
    ]);

    expect(stats[0].cumsum).toBe(10);
  });

  it('keeps an activity that has a single record', () => {
    const stats = statsOf([recordOf(piano, '2025-09-01', 2)]);

    expect(stats).toHaveLength(1);
  });

  it('reports one entry per activity', () => {
    const stats = statsOf([
      recordOf(piano, '2025-09-01', 2),
      recordOf(bike, '2025-09-01', 4),
      recordOf(piano, '2025-09-02', 3),
    ]);

    expect(stats).toHaveLength(2);
  });

  it('reports the date of the most recent record', () => {
    const stats = statsOf([
      recordOf(piano, '2025-09-02', 3),
      recordOf(piano, '2025-09-20', 1),
      recordOf(piano, '2025-09-10', 2),
    ]);

    expect(stats[0].last.format('YYYY-MM-DD')).toBe('2025-09-20');
  });

  it('reports no statistics for an empty history', () => {
    expect(statsOf([])).toEqual([]);
  });

  it('applies the activity unit amount to the total', () => {
    const stats = statsOf([recordOf(piano, '2025-09-01', 3)]);

    expect(stats[0].total).toBe(3 * piano.amount);
  });

  it('produces one series value per bucket', () => {
    const history = new StatsEngine(dayjs('2025-09-01'), dayjs('2025-09-30'), [
      recordOf(piano, '2025-09-01', 3),
    ]).computeStats('day');

    expect(history.stats[0].series).toHaveLength(history.buckets.length);
  });

  it('adds up records falling into the same bucket', () => {
    const stats = statsOf(
      [recordOf(piano, '2025-09-01', 2), recordOf(piano, '2025-09-03', 3)],
      'month',
    );

    expect(stats[0].series).toEqual([5 * piano.amount]);
  });

  it('leaves a bucket without record at zero', () => {
    const stats = statsOf(
      [recordOf(piano, '2025-09-01', 2), recordOf(piano, '2025-09-03', 1)],
      'day',
    );

    expect(stats[0].series.slice(0, 3)).toEqual([
      2 * piano.amount,
      0,
      1 * piano.amount,
    ]);
  });

  it('averages over the number of covered periods, not the date span', () => {
    const stats = statsOf([recordOf(piano, '2025-09-01', 2)], 'month');

    expect(stats[0].average).toBe(2 * piano.amount);
  });

  it('sorts activities by decreasing total', () => {
    const stats = statsOf([
      recordOf(bike, '2025-09-01', 1),
      recordOf(piano, '2025-09-01', 1),
    ]);

    expect(stats.map((stat) => stat.activity.id)).toEqual([piano.id, bike.id]);
  });
});
