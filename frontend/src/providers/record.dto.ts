import { Activity } from "../domain/activity";
import { DjsDate } from "../domain/date";

export interface RecordDto {
    activity: Activity,
    date: DjsDate;
}