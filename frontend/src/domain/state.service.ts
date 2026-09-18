import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Activity,
  ActivityRecord,
  DateSampling,
  DjsDate,
  HistoryStats,
} from '@lifetrack/lib';
import { ActivityDto } from './activities';
import { API_PROVIDER } from './api.provider.interface';
import { DateService } from './date.service';

export type StatsSlice =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; history: HistoryStats }
  | { status: 'error'; message: string };

export interface LifetrackState {
  loading: boolean;
  /** Derniere action ayant echoue, affichee par le shell. */
  error: string | null;
  records: Record<string, ActivityRecord>;
  activities: Record<string, Activity>;
  top: Record<string, Activity>;
  // Tranche distincte de `records` : celui-ci est reecrit par la navigation du
  // calendrier, ce qui tronquerait silencieusement la plage des statistiques.
  stats: StatsSlice;
}

const initialState: LifetrackState = {
  loading: true,
  error: null,
  records: {},
  activities: {},
  top: {},
  stats: { status: 'idle' },
};

@Injectable()
export class StateService {
  private dateService = inject(DateService);
  private api = inject(API_PROVIDER);

  private store = signal<LifetrackState>(initialState);
  public readonly selectLoading = computed(() => this.store().loading);

  public readonly selectDaily = computed(() => {
    const date = this.dateService.selectedDateSignal();
    return Object.values(this.store().records).filter((record) =>
      record.date.isSame(date, 'day'),
    );
  });

  public readonly selectActivities = computed(() => {
    return this.store().activities;
  });

  public readonly selectTopActivities = computed(() => {
    return this.store().top;
  });

  public readonly selectStats = computed(() => this.store().stats);

  public readonly selectError = computed(() => this.store().error);

  public dismissError(): void {
    this.store.set({ ...this.store(), error: null });
  }

  /** Sans ce report, une ecriture qui echoue reste totalement invisible. */
  private fail(action: string) {
    return (error: unknown): false => {
      this.store.set({
        ...this.store(),
        error: `${action} failed. ${messageOf(error)}`,
      });
      return false;
    };
  }

  loadStats(start: DjsDate, end: DjsDate, sampling: DateSampling): void {
    this.setStats({ status: 'loading' });
    this.api
      .getHistoryStats(start, end, sampling)
      .then((history) => this.setStats({ status: 'ready', history }))
      .catch((error: unknown) =>
        this.setStats({ status: 'error', message: messageOf(error) }),
      );
  }

  private setStats(stats: StatsSlice): void {
    this.store.set({ ...this.store(), stats });
  }

  addActivity(dto: ActivityDto): Promise<boolean> {
    return this.api
      .addActivity(dto)
      .then((newActivity) => {
        const store = this.store();
        const updated = { ...store.activities, [newActivity.id]: newActivity };
        this.store.set({ ...store, activities: updated });
        return true;
      })
      .catch(this.fail('Adding the activity'));
  }
  deleteActivity(activity: Activity): Promise<boolean> {
    return this.api
      .deleteActivity(activity.id)
      .then((_) => {
        const { [activity.id]: removed, ...rest } = this.store().activities;
        this.store.set({
          ...this.store(),
          activities: rest,
        });
        return true;
      })
      .catch(this.fail('Deleting the activity'));
  }
  updateActivity(activity: Activity): Promise<boolean> {
    return this.api
      .updateActivity(activity)
      .then((a) => {
        const store = this.store();
        const activitiesUpdated = { ...store.activities, [a.id]: a };
        const updatedRecords = Object.fromEntries(
          Object.entries(store.records).map(([key, value]) => {
            if (value.activity.id === a.id)
              return [key, { ...value, activity: a }];
            else return [key, value];
          }),
        );
        this.store.set({
          ...store,
          activities: activitiesUpdated,
          records: updatedRecords,
        });
        return true;
      })
      .catch(this.fail('Updating the activity'));
  }
  loadActivities() {
    this.api
      .getTopActivities()
      .then((list) => {
        this.store.set({
          ...this.store(),
          top: list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
        });
      })
      .catch(this.fail('Loading the activities'));
    this.api
      .getActivities()
      .then((list) => {
        this.store.set({
          ...this.store(),
          activities: list.reduce(
            (acc, item) => ({ ...acc, [item.id]: item }),
            {},
          ),
        });
      })
      .catch(this.fail('Loading the activities'));
  }
  loadHistory(start: DjsDate, end: DjsDate): void {
    this.api
      .getHistory(start, end)
      .then((list) => {
        this.store.set({
          ...this.store(),
          records: list.reduce(
            (acc, item) => ({ ...acc, [item.id]: item }),
            {},
          ),
        });
      })
      .catch(this.fail('Loading the history'));
  }
  recordActivity(activity: Activity): void {
    const date = this.dateService.selectedDateSignal();
    this.api
      .recordActivity(activity, date)
      .then((updated) => {
        this.store.set({
          ...this.store(),
          records: { ...this.store().records, [updated.id]: updated },
        });
      })
      .catch(this.fail('Recording the activity'));
  }

  downRecord(record: ActivityRecord): void {
    this.api
      .downsertRecord(record)
      .then((updated) => {
        if (updated === null) {
          const { [record.id]: removed, ...rest } = this.store().records;
          this.store.set({
            ...this.store(),
            records: rest,
          });
        } else {
          this.store.set({
            ...this.store(),
            records: { ...this.store().records, [updated.id]: updated },
          });
        }
      })
      .catch(this.fail('Updating the record'));
  }
}

function messageOf(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    return error.status === 0
      ? 'Server unreachable'
      : `Server answered ${error.status}`;
  }
  return 'Unexpected error';
}
