import { Activity } from "../domain/activity";

export interface RecordDto {
    activity: Activity,
    date: Date;
}