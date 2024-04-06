import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { ActivityRecord } from "./activity";
import { RecordDto } from "../providers/record.dto";

export const RECORD_PROVIDER = new InjectionToken<IRecordProvider>("record.provider.interface");

export interface IRecordProvider {

    upsertRecord(userId: string, record: RecordDto): Observable<ActivityRecord>
    getUserHistory(userId: string, month: number, year: number): Observable<ActivityRecord[]>
    downsertRecord(userId: string, record: RecordDto): Observable<ActivityRecord>
    getUserDaily(userId: string, date: Date): Observable<ActivityRecord[]>;
}