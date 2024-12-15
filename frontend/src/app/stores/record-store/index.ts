import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ActivityRecord } from "../../../domain/activity";

export interface RecordState {
    [activityId: string]: ActivityRecord
}

const selectRecordsRaw = createFeatureSelector<RecordState>('records');
export const selectAllRecords = createSelector(
    selectRecordsRaw,
    (records: RecordState) => Object.values(records)
)

export const selectDailyRecord = (date: Date) => createSelector(
    selectAllRecords, 
    (records: ActivityRecord[]) => {
        const filteredDate = new Date(date);
        filteredDate.setHours(0,0,0,0)
        const filter = records.filter((item) => { 
            const itemDate = new Date(item.date);
            itemDate.setHours(0,0,0,0);
            return itemDate.getTime() === filteredDate.getTime();
        });
        return filter;
    }
)