import {
  EnvironmentProviders,
  Provider,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { Activity, ActivityRecord, HistoryStats } from '@lifetrack/lib';
import dayjs from 'dayjs';
import { ILifetrackApi } from '../domain/api.provider.interface';
import { API_PROVIDER } from '../domain/api.provider.interface';
import { StateService } from '../domain/state.service';

const emptyStats: HistoryStats = {
  start: dayjs(),
  end: dayjs(),
  sampling: 'month',
  buckets: [],
  stats: [],
};

/** Frontiere HTTP : la seule chose qu'on double, le reste est le vrai service. */
export const apiStub: ILifetrackApi = {
  getHistory: (): Promise<ActivityRecord[]> => Promise.resolve([]),
  getActivities: (): Promise<Activity[]> => Promise.resolve([]),
  deleteActivity: (): Promise<void> => Promise.resolve(),
  updateActivity: (activity: Activity): Promise<Activity> =>
    Promise.resolve(activity),
  getTopActivities: (): Promise<Activity[]> => Promise.resolve([]),
  addActivity: (): Promise<Activity> =>
    Promise.resolve({
      id: 'stub',
      unit: 'x',
      amount: 1,
      representation: 'S',
      description: 'Stub',
    }),
  recordActivity: (activity: Activity): Promise<ActivityRecord> =>
    Promise.resolve({ id: 'stub', activity, date: dayjs(), number: 1 }),
  downsertRecord: (): Promise<ActivityRecord | null> => Promise.resolve(null),
  getHistoryStats: (): Promise<HistoryStats> => Promise.resolve(emptyStats),
};

export function testProviders(): (Provider | EnvironmentProviders)[] {
  return [
    provideZonelessChangeDetection(),
    provideRouter([]),
    provideAuth0({ domain: 'test.auth0.com', clientId: 'test-client' }),
    { provide: API_PROVIDER, useValue: apiStub },
    StateService,
  ];
}
