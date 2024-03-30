import { Observable } from "rxjs";
import { ActivityRecord } from "./activity";

export interface IRecord {

    saveRecord(record: ActivityRecord): Observable<ActivityRecord>
    getUserHistory(userId: string): Observable<ActivityRecord[]>
    deleteRecord(recordId: string): Observable<ActivityRecord>
    
}