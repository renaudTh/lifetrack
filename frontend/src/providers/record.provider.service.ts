import { Inject, Injectable } from "@angular/core";
import { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { Observable, from, map, switchMap, tap } from "rxjs";
import { Activity, ActivityRecord } from "../domain/activity";
import { IRecordProvider } from "../domain/record.provider.interface";

export interface RecordsExists {
    exists: boolean,
    id?: string,
    number?: number
}

export interface RecordUpsertDto {
    id?: string,
    number: number,
    user_id: string,
    date: Date,
    activity_id: string,
}

@Injectable()
export class ActivityRecordProvider implements IRecordProvider {

    private _recordQuery = `
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
    `
    constructor(@Inject("SUPABASE_CLIENT") private _supabase: SupabaseClient) { }

    private recordsExists(userId: string, date: Date, activity: Activity): Observable<ActivityRecord | null> {
        const dateString = date.toISOString().split("T")[0];
        return from(this._supabase.from('records')
            .select(this._recordQuery, { count: "estimated" })
            .eq('user_id', userId)
            .eq('date', dateString)
            .eq('activity_id', activity.id)).pipe(
                map((response: PostgrestSingleResponse<any>): ActivityRecord | null => {
                    if (response.error !== null) {
                        throw response.error
                    }
                    if (response.count! > 0) {
                        const item = response.data[0]
                        return {
                            id: item.id,
                            activity: item.activities,
                            date: new Date(item.date),
                            number: item.number
                        }
                    }
                    else return null
                }))
    }

    private _upsertRecord(record: RecordUpsertDto): Observable<ActivityRecord> {
        return from(this._supabase.from("records").upsert(record).select(this._recordQuery)).pipe(
            map((response: PostgrestSingleResponse<any>) => {
                if (response.error !== null || response.data == null) {
                    throw response.error;
                }
                return response.data[0];
            }),
            map((data): ActivityRecord => ({
                id: data.id,
                date: new Date(data.date),
                number: data.number,
                activity: data.activities
            })))
    }

    upsertRecord(userId: string, date: Date, activity: Activity): Observable<ActivityRecord> {
        return this.recordsExists(userId, date, activity).pipe(
            switchMap((record) => {
                let update: RecordUpsertDto;
                if (null === record) {
                    update = {
                        number: 1,
                        date: date,
                        activity_id: activity.id,
                        user_id: userId,
                    }
                }
                else {
                    update = {
                        id: record.id,
                        number: record.number + 1,
                        user_id: userId,
                        date: date,
                        activity_id: record.activity.id,
                    }
                }
                return this._upsertRecord(update)
            }))
    }
    getUserMonthHistory(userId: string, date: Date): Observable<ActivityRecord[]> {
        
        const month = date.getMonth();
        const startDate = new Date(date);
        startDate.setDate(1);
        const endDate = new Date(date)
        endDate.setMonth(month+1)
        endDate.setDate(1)
        const start = startDate.toISOString().split("T")[0];
        const end = endDate.toISOString().split("T")[0];
        return from(this._supabase
            .from('records')
            .select(this._recordQuery)
            .eq('user_id', userId)
            .gte('date', start)
            .lt('date', end)).pipe(
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
    downsertRecord(userId: string, record: ActivityRecord): Observable<ActivityRecord> {

        if (record.number - 1 > 0) {
            return this._upsertRecord({
                activity_id: record.activity.id,
                date: record.date,
                number: record.number - 1,
                user_id: userId,
                id: record.id
            })
        }
        else {
            return from(this._supabase.from('records').delete().eq('id', record.id).eq('user_id', userId).select()).pipe(
                map((response: PostgrestSingleResponse<any>): ActivityRecord | null => {
                    if (response.error !== null) {
                        throw new Error("Impossible to downsert record");
                    }
                    return response.data[0];
                }),
                map((data: any): ActivityRecord => ({
                    activity: data.activities,
                    date: new Date(data.date),
                    id: data.id,
                    number: data.number - 1
                }))
            )
        }
    }

}
