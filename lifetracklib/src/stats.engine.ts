import weekOfYear from 'dayjs/plugin/weekOfYear';
import dayjs from 'dayjs';
import { DateSampling, DjsDate } from './models/date.model';
import { Activity, ActivityRecord } from './models/activity.model';
import { ActivityStats } from './models/stats.model';

export class StatsEngine {
  private groupped = new Map<string, ActivityRecord[]>();

  constructor(
    private start: DjsDate,
    private end: DjsDate,
    private records: ActivityRecord[],
  ) {
    dayjs.extend(weekOfYear);
    this.records.forEach((record) => {
      const key = record.activity.id;
      const exists = this.groupped.get(record.activity.id);
      this.groupped.set(key, exists ? [...exists, record] : []);
    });
  }

  private getSampleKey(sampling: DateSampling, date: DjsDate) {
    switch (sampling) {
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

  public generateSampleKeys(sampling: DateSampling): Set<string> {
    const res = new Set<string>();
    let date = this.start.clone();
    while (!date.isSame(this.end, sampling)) {
      date = date.add(1, sampling);
      res.add(this.getSampleKey(sampling, date));
    }
    return res;
  }
  public computeMean(sample: DateSampling, records: ActivityRecord[]): number {
    if (records.length < 1) {
      return 0;
    }
    const activity = records[0].activity;
    const keys = this.generateSampleKeys(sample)
      .values()
      .map((date): [string, number] => [date, 0]);
    const map = new Map<string, number>(keys);
    records.forEach((record) => {
      const key = this.getSampleKey(sample, record.date);
      const value = map.get(key) ?? 0;
      map.set(key, value + activity.amount * record.number);
    });
    return map.values().reduce((acc, curr) => acc + curr, 0) / map.size;
  }
  public computeStats(records: ActivityRecord[]): ActivityStats[] {
    const groupped = Object.groupBy(records, (item) => item.activity.id);
    return Object.values(groupped).flatMap((records): ActivityStats[] => {
      if (!records || records.length < 1) return [];
      const activity = records[0].activity;
      const last = records.toSorted((a, b) => a.date.unix() - b.date.unix())[0]
        .date;
      const weekMean = this.computeMean('week', records);
      const monthMean = this.computeMean('month', records);
      const dayMean = this.computeMean('day', records);
      const yearMean = this.computeMean('year', records);
      return [
        {
          activity,
          averages: {
            day: dayMean,
            month: monthMean,
            week: weekMean,
            year: yearMean,
          },
          last,
        },
      ];
    });
  }
}
