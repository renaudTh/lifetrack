import { Injectable } from "@angular/core";
import { IRecordProvider } from "../domain/record.provider.interface";
import { BehaviorSubject, Observable, filter, map, of } from "rxjs";
import { ActivityRecord } from "../domain/activity";

@Injectable()
export class ActivityRecordProvider implements IRecordProvider
{

    private _records: ActivityRecord[] = [
        {
            id: "0",
            date: new Date("2024-04-01"),
            activity:{
                id: "4",
                representation: "🍺",
                amount: 25,
                unit:  "cl",
                description: "Drink a beer"
            },
            
        },
        {
            id: "1",
            date: new Date("2024-04-02"),
            activity:{
                id: "2",
                representation: "🎹",
                amount: 30,
                unit:  "min",
                description: "Play the piano"
            },
            
        },
        {
            id: "1",
            date: new Date("2024-04-02"),
            activity:{
                id: "2",
                representation: "🎹",
                amount: 30,
                unit:  "min",
                description: "Play the piano"
            },
            
        }
    ];
    private _recordSubject = new BehaviorSubject<ActivityRecord[]>(this._records);
    private selectedRecord$ = this._recordSubject.asObservable();

    saveRecord(record: ActivityRecord): Observable<ActivityRecord> {
        this._records = [...this._records, record];
        this._recordSubject.next(this._records);
        return of(record);
    }
    getUserHistory(userId: string, month: number, year: number): Observable<ActivityRecord[]> {
        const ret = this._records.filter((record) => {record.date.getMonth() === month && record.date.getFullYear() === year});
        return of(ret);
    }
    getUserDaily(userId: string, date: Date): Observable<ActivityRecord[]> {
       return this.selectedRecord$.pipe(
        map((records) => records.filter((record) => record.date.toDateString() === date.toDateString()))
       )
    }  
    deleteRecord(recordId: string): Observable<ActivityRecord> {
        const deleted = this._records.find((record) => record.id === recordId);
        if(!deleted){
            throw new Error("The record does not exists!");
        }
        this._records = this._records.filter((record) => record.id !== recordId);
        return of(deleted);

    }
}
