import { computed, inject, Injectable, signal } from "@angular/core";
import { Activity, ActivityRecord, DjsDate } from "@lifetrack/lib";
import { API_PROVIDER } from "./api.provider.interface";
import { DateService } from "./date.service";


export interface LifetrackState {
    loading: boolean,
    records: Record<string, ActivityRecord>
    activities: Record<string, Activity>;
}

const initialState: LifetrackState = {
    loading: true,
    records: {},
    activities: {}
}

@Injectable()
export class StateService {


    private dateService = inject(DateService);
    private api = inject(API_PROVIDER);

    private store = signal<LifetrackState>(initialState);
    public readonly selectLoading = computed(() => this.store().loading);

    public readonly selectDaily = computed(() => {
        const date = this.dateService.selectedDateSignal();
        return Object.values(this.store().records).filter((record) => record.date.isSame(date, 'day'))
    })

    public readonly selectActivities = computed(() => {
        return this.store().activities
    })

    loadActivities() {
        this.api.getActivities().then((list) => {
            this.store.set({
                ...this.store(),
                activities: list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
            })
        })
    }
    loadHistory(start: DjsDate, end: DjsDate): void {
        this.api.getHistory(start, end).then((list) => {
            this.store.set({
                ...this.store(),
                records: list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
            })
        })
    }
    recordActivity(activity: Activity): void {
        const date = this.dateService.selectedDateSignal();
        this.api.recordActivity(activity, date).then((updated) => {
            this.store.set({
                ...this.store(),
                records: { ...this.store().records, [updated.id]: updated }
            })
        })
    }

    downRecord(record: ActivityRecord): void {
        this.api.downsertRecord(record).then((updated) => {
            if (updated === null) {
                const { [record.id]: removed, ...rest } = this.store().records;
                this.store.set({
                    ...this.store(),
                    records: rest
                })
            }
            else {
                this.store.set({
                    ...this.store(),
                    records: { ...this.store().records, [updated.id]: updated }
                })
            }
        })

    }
}