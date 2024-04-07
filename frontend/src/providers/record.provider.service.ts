import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map, of } from "rxjs";
import { ActivityRecord } from "../domain/activity";
import { IRecordProvider } from "../domain/record.provider.interface";
import { RecordDto } from "./record.dto";

@Injectable()
export class ActivityRecordProvider implements IRecordProvider {



    private _records: ActivityRecord[] = [
        {
            id: "0",
            date: new Date("2024-04-01"),
            activity: {
                id: "4",
                representation: "🍺",
                amount: 25,
                unit: "cl",
                description: "Drink a beer"
            },
            number: 2,

        },
        {
            id: "1",
            date: new Date("2024-04-02"),
            activity: {
                id: "2",
                representation: "🎹",
                amount: 30,
                unit: "min",
                description: "Play the piano"
            },
            number: 2,
        },
        {
            id: "2",
            date: new Date("2024-05-02"),
            activity: {
                id: "2",
                representation: "🎹",
                amount: 30,
                unit: "min",
                description: "Play the piano"
            },
            number: 2,
        },

    ];
    private _recordSubject = new BehaviorSubject<ActivityRecord[]>(this._records);
    private selectedRecord$ = this._recordSubject.asObservable();

    upsertRecord(userId: string, record: RecordDto): Observable<ActivityRecord> {
        const foundRecord = this._records.find((r) => r.date.toDateString() === record.date.toDateString() && r.activity.id === record.activity.id);
        let newRecord: ActivityRecord;
        if(!foundRecord){
            newRecord = {
                activity: record.activity,
                date: record.date,
                id: `${Math.floor(5 + Math.random() * 995)}`,
                number: 1
            }
            this._records = [...this._records, newRecord]
        }
        else {
            newRecord = {
                ...foundRecord,
                number: foundRecord.number + 1
            }
           
            this._records = this._records.map((record) => 
                ((record.id === newRecord.id) ? newRecord : record)
            )
        }
        this._recordSubject.next(this._records);
        return of(newRecord);
    }
    getUserMonthHistory(userId: string, date: Date): Observable<ActivityRecord[]> {
        const ret = this._records.filter((record) => (record.date.getMonth() === date.getMonth() && record.date.getFullYear() === date.getFullYear()));
        return of(ret);
    }
    getUserDaily(userId: string, date: Date): Observable<ActivityRecord[]> {
        return this.selectedRecord$.pipe(
            map((records) => records.filter((record) => record.date.toDateString() === date.toDateString()))
        )
    }
    downsertRecord(userId: string, record: RecordDto): Observable<ActivityRecord> {
        const foundRecord = this._records.find((r) => r.date.toDateString() === record.date.toDateString() && r.activity.id === record.activity.id);
        let newRecord: ActivityRecord;
        if(!foundRecord){
            throw new Error("Record not found!");
        }
        else {
            newRecord = {
                ...foundRecord,
                number: foundRecord.number - 1
            }
            this._records = this._records.map((record) => 
                ((record.id === newRecord.id) ? newRecord : record)
            )
        }
        this._recordSubject.next(this._records);
        return of(newRecord);
    }
}
