import { ActivityRecord, ActivityStats } from './activity';
import { DateSampling, DjsDate } from './date';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import dayjs from 'dayjs';

export class StatsEngine {
  constructor(
    private start: DjsDate,
    private end: DjsDate,
    private sampling: DateSampling
  ) {
    dayjs.extend(weekOfYear);
  }

  private getSampleKey(date: DjsDate) {
    switch (this.sampling) {
      case 'day':
        return date.format('YYYY-MM-DD');
      case 'week':
        return `${date.year()}-${date.week()}`;
      case 'month':
        return date.format('YYYY-MM');
      case 'year':
        return date.format('YYYY');
    }
  }

  public generateSampleKeys(): string[] {
    const res: string[] = [];
    let s = this.start.clone();
    while (!s.isSame(this.end, this.sampling)) {
      s = s.add(1, this.sampling);
      res.push(this.getSampleKey(s));
    }
    return res;
  }

  public compute(records: ActivityRecord[]): ActivityStats[] {
    dayjs.extend(weekOfYear);
    const sample = this.generateSampleKeys();
    const groupped = Object.groupBy(records, (item) => item.activity.id);
    return Object.entries(groupped).map(([id, records]): ActivityStats => {
      const result = new Map<string, number>();
      for (const key of sample) {
        result.set(key, 0);
        for (const r of records!) {
          const recordKey = this.getSampleKey(r.date);
          const prev = result.get(key);
          if (prev !== undefined && recordKey === key) {
            result.set(key, prev + r.number * r.activity.amount);
          }
        }
      }
      return {
        activityId: id,
        data: [...result.values()],
      };
    });
  }
}
