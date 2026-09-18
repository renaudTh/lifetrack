import { Activity } from './activity.model';
import { DateSampling, DjsDate } from './date.model';

export type HistoryStats = {
  start: DjsDate;
  end: DjsDate;
  sampling: DateSampling;
  /** Period keys covering [start, end], in chronological order. */
  buckets: string[];
  stats: ActivityStats[];
};

export interface ActivityStats {
  activity: Activity;
  /** Raw sum of the recorded quantities. */
  cumsum: number;
  /** cumsum expressed in the activity's unit. */
  total: number;
  /** total divided by the number of periods covered. */
  average: number;
  last: DjsDate;
  /** One value per bucket, same length and order as HistoryStats.buckets. */
  series: number[];
}

/** What actually travels over the wire: dates are ISO strings there. */
export type ActivityStatsDTO = Omit<ActivityStats, 'last'> & { last: string };

export type HistoryStatsDTO = Omit<HistoryStats, 'start' | 'end' | 'stats'> & {
  start: string;
  end: string;
  stats: ActivityStatsDTO[];
};
