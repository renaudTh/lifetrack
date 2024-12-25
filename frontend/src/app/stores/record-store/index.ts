import { ActivityRecord, DjsDate } from "@lifetrack/lib";
import { createFeatureSelector, createSelector } from "@ngrx/store";


export interface RecordState {
    [activityId: string]: ActivityRecord
}

const selectRecordsRaw = createFeatureSelector<RecordState>('records');
export const selectAllRecords = createSelector(
    selectRecordsRaw,
    (records: RecordState) => Object.values(records)
)

export const selectDailyRecord = (date: DjsDate) => createSelector(
    selectAllRecords, 
    (records: ActivityRecord[]) => {
        const filter = records.filter((item) => { 
            return item.date.isSame(date, "day")
        });
        return filter;
    }
)