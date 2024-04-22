import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { Activity, ActivityRecord } from "./activity";
import { RecordDto } from "../providers/record.dto";

export const RECORD_PROVIDER = new InjectionToken<IRecordProvider>("record.provider.interface");

export interface IRecordProvider {

    upsertRecord(userId: string, date: Date, activity: Activity): Observable<ActivityRecord>
    getUserMonthHistory(userId: string,date:Date): Observable<ActivityRecord[]>
    downsertRecord(userId: string, record: ActivityRecord): Observable<ActivityRecord>
}