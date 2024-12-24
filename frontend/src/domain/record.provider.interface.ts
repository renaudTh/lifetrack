import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { RecordDto } from "../providers/record.dto";
import { ActivityRecord } from "./activity";
import { DjsDate } from "./date";

export const RECORD_PROVIDER = new InjectionToken<IRecordProvider>("record.provider.interface");

export interface IRecordProvider {

    upsertRecord(record: RecordDto): Observable<ActivityRecord>
    getUserMonthHistory(date: DjsDate): Observable<ActivityRecord[]>
    downsertRecord(record: ActivityRecord): Observable<ActivityRecord>
    getRecordsBetweenDates(start: DjsDate, end: DjsDate): Observable<ActivityRecord[]>
}