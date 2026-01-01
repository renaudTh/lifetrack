import { InjectionToken } from '@angular/core';
import {
  Activity,
  ActivityRecord,
  DjsDate,
  HistoryStats,
} from '@lifetrack/lib';
import { ActivityDto } from './activities';

export const API_PROVIDER = new InjectionToken<ILifetrackApi>(
  'lifetrack.api.provider',
);

export interface ILifetrackApi {
  getHistory(sart: DjsDate, end: DjsDate): Promise<ActivityRecord[]>;
  getActivities(): Promise<Activity[]>;
  deleteActivity(id: string): Promise<void>;
  updateActivity(activity: Activity): Promise<Activity>;
  getTopActivities(): Promise<Activity[]>;
  addActivity(dto: ActivityDto): Promise<Activity>;
  recordActivity(activity: Activity, date: DjsDate): Promise<ActivityRecord>;
  downsertRecord(record: ActivityRecord): Promise<ActivityRecord | null>;
  getHistoryStats(start: DjsDate, end: DjsDate): Promise<HistoryStats>;
}
