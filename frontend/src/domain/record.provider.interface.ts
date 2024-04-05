import { Observable } from "rxjs";
import { ActivityRecord } from "./activity";
import { InjectionToken } from "@angular/core";

export const RECORD_PROVIDER = new InjectionToken<IRecordProvider>("record.provider.interface");

export interface IRecordProvider {

    saveRecord(record: ActivityRecord): Observable<ActivityRecord>
    getUserHistory(userId: string, month: number, year: number): Observable<ActivityRecord[]>
    deleteRecord(recordId: string): Observable<ActivityRecord>
    getUserDaily(userId: string, date: Date): Observable<ActivityRecord[]>;
}