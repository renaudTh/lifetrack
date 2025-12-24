import { Activity } from './activity.model';
import { DateSampling, DjsDate } from './date.model';

export type HistoryStats = {
  start: DjsDate;
  end: DjsDate;
  samplings: {
    day: number;
    week: number;
    month: number;
    year: number;
  };
  stats: ActivityStats[];
};

export interface ActivityStats {
  activity: Activity;
  cumsum: number;
  last: DjsDate;
}

export type GraphData = {
  samplig: DateSampling;
  data: Record<string, number>;
};
