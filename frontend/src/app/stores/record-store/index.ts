import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ActivityRecord } from "../../../domain/activity";
import { DjsDate } from "../../../domain/date";

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