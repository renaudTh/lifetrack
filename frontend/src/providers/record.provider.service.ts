import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, from, map, of } from "rxjs";
import { ActivityRecord } from "../domain/activity";
import { IRecordProvider } from "../domain/record.provider.interface";
import { RecordDto } from "./record.dto";
import { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { FactoryTarget } from "@angular/compiler";

export interface RecordsExists {
    exists: boolean,
    id?: string,
    number?: number
}

@Injectable()
export class ActivityRecordProvider implements IRecordProvider {


    constructor(@Inject("SUPABASE_CLIENT") private _supabase: SupabaseClient) { }

    private recordsExists(userId: string, record: RecordDto): Observable<RecordsExists> {
        const date = record.date.toISOString().split("T")[0];
        return from(this._supabase.from('records')
            .select('id, number', { count: "estimated" })
            .eq('user_id', userId)
            .eq('date', date)
            .eq('activity_id', record.activity.id)).pipe(
                map((response: PostgrestSingleResponse<any>): RecordsExists => {
                    if (response.error !== null) {
                        throw new Error("Impossible to upsert record");
                    }
                    if (response.count! > 0) {
                        const data = response.data[0]
                        return {
                            exists: true,
                            id: data.id,
                            number: data.number
                        }
                    }
                    else return { exists: false }
                }))
    }

    upsertRecord(userId: string, record: RecordDto): Observable<ActivityRecord> {
        this.recordsExists(userId, record).subscribe((exists) => {
            console.log(exists);
        })
        return EMPTY;
    }
    getUserMonthHistory(userId: string, date: Date): Observable<ActivityRecord[]> {
        return from(this._supabase
            .from('records')
            .select(`
            id,
            date,
            number,
            activities (
                id,
                description,
                representation,
                unit,
                amount
            )
        `)
            .eq('user_id', userId)
            .gte('date', '2024-04-01')
            .lt('date', '2024-05-01')).pipe(
                map((response: PostgrestSingleResponse<any>) => {
                    if (response.error !== null || response.data === null) {
                        throw new Error("Impossible to retrieve Records");
                    }
                    return response.data
                }),
                map((data: any) => data.map((item: any): ActivityRecord => ({
                    id: item.id,
                    activity: item.activities,
                    date: new Date(item.date),
                    number: item.number
                })))
            )
    }
    getUserDaily(userId: string, date: Date): Observable<ActivityRecord[]> {
        throw new Error("Not Implemented");

    }
    downsertRecord(userId: string, record: RecordDto): Observable<ActivityRecord> {
        throw new Error("Not Implemented");
    }

}
