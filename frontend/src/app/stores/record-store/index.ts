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
