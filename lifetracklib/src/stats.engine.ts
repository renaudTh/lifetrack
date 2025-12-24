import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { ActivityRecord } from './models/activity.model';
import { DateSampling, DjsDate } from './models/date.model';
import { ActivityStats, HistoryStats } from './models/stats.model';

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

export function getSampleKey(date: DjsDate, sampling: DateSampling): string {
  switch (sampling) {
    case 'day':
      return date.format('YYYY-MM-DD');
    case 'week':
      return `${date.year()}-${date.format('ww')}`;
    case 'month':
      return date.format('YYYY-MM');
    case 'year':
      return date.format('YYYY');
  }
}

export function generateSampleKeys(
  start: DjsDate,
  end: DjsDate,
  sampling: DateSampling,
): Set<string> {
  const res = new Set<string>();
  let date = start.clone();
  res.add(getSampleKey(date, sampling));
  if (end.isBefore(start)) {
    throw new Error('End date is before start date !');
  }
  while (!date.isSame(end, sampling)) {
    date = date.add(1, sampling);
    res.add(getSampleKey(date, sampling));
  }
  return res;
}

export class StatsEngine {
  private groupped = new Map<string, ActivityRecord[]>();
  private samplings: Record<DateSampling, number> = {
    day: 0,
    week: 0,
    year: 0,
    month: 0,
  };
  constructor(
    private start: DjsDate,
    private end: DjsDate,
    private records: ActivityRecord[],
  ) {
    this.samplings = {
      day: this.end.diff(this.start, 'days'),
      week: this.end.diff(this.start, 'weeks'),
      month: this.end.diff(this.start, 'months'),
      year: this.end.diff(this.start, 'year'),
    };
    this.records.forEach((record) => {
      const key = record.activity.id;
      const exists = this.groupped.get(key);
      this.groupped.set(key, exists ? [...exists, record] : []);
    });
  }

  public computeStats(): HistoryStats {
    const history = [...this.groupped.values()].flatMap(
      (records): ActivityStats[] => {
        if (!records || records.length < 1) return [];
        const activity = records[0].activity;
        const last = records.toSorted(
          (a, b) => b.date.unix() - a.date.unix(),
        )[0].date;
        const cumsum = records.reduce((acc, curr) => acc + curr.number, 0);
        return [
          {
            activity,
            cumsum,
            last,
          },
        ];
      },
    );
    return {
      start: this.start,
      end: this.end,
      samplings: this.samplings,
      stats: history,
    };
  }
}
