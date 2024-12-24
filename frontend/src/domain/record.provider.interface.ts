import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { ActivityRecord } from "./activity";
import { RecordDto } from "../providers/record.dto";

export const RECORD_PROVIDER = new InjectionToken<IRecordProvider>("record.provider.interface");

export interface IRecordProvider {

    upsertRecord(record: RecordDto): Observable<ActivityRecord>
    getUserMonthHistory(date: DjsDate): Observable<ActivityRecord[]>
    downsertRecord(record: ActivityRecord): Observable<ActivityRecord>
}