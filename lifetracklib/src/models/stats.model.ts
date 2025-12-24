import { Activity } from './activity.model';
import { DjsDate } from './date.model';

export interface ActivityStats {
  activity: Activity;
  averages: {
    day: number;
    month: number;
    week: number;
    year: number;
  };
  last: DjsDate;
}
