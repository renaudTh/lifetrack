import { inject } from "@angular/core";
import { ID, Models, Query } from "appwrite";
import dayjs from "dayjs";
import { from, map, Observable, switchMap } from "rxjs";
import { IRecordProvider } from "../domain/record.provider.interface";
import { ApiService } from "./api.service";
import { RecordDto } from "./record.dto";
import { ActivityRecord, DjsDate } from "@lifetrack/lib";

export class RecordProviderService implements IRecordProvider {


    private readonly api = inject(ApiService);
    private collectionId = '675db2c70024c64a4934';
    
    constructor(){
    }

    getRecordsBetweenDates(start: DjsDate, end: DjsDate): Observable<ActivityRecord[]> {
        const request = this.api.listDocuments(
            this.collectionId,
            [Query.and([Query.lessThan('date', end.toISOString()),Query.greaterThan('date', start.toISOString())])]
        );
        const result = request.then((result) => result.documents.map((doc) => this.parseDocument(doc)))
        return from(result);
    }

    private parseDocument(doc: Models.Document): ActivityRecord {
        return {
            activity: {
                amount:doc['activity']["base_amount"],
                description: doc["activity"]["description"],
                id: doc["activity"]["$id"],
                representation: doc["activity"]["representation"],
                unit: doc["activity"]["unit"]
            },
            date: dayjs(doc['date']),
            id: doc.$id,
            number: doc["amount"]
        }
    }

    upsertRecord(recordDto: RecordDto): Observable<ActivityRecord> {
        //Get all daily records
        const start = recordDto.date.clone();
        start.hour(0).minute(0).second(0).millisecond(0).toISOString();
        const end = recordDto.date.clone();
        end.hour(23).minute(59).second(59).millisecond(999).toISOString();


        const recordsResult = this.getRecordsBetweenDates(start, end);
        return from(recordsResult).pipe(
            //Filter by concerned activity
            map((list) => list.filter((record) => record.activity.id === recordDto.activity.id)),
            switchMap((list) => {
                //If activity recorded for the given date, create it
                if(list.length === 0){
                    const body: any = {
                        "id": "1",
                        "amount": 1,
                        "activity": recordDto.activity.id,
                        "date": recordDto.date
                    }
                    const request = this.api.createDocument(this.collectionId, ID.unique(), body);
                    const response = request.then((doc) => this.parseDocument(doc));
                    return from(response);
                }
                //Else update the amount
                else {
                    const element = list[0];
                    const request = this.api.updateDocument(this.collectionId, element.id, {amount: element.number + 1 });
                    const response = request.then((doc) => this.parseDocument(doc));
                    return from(response);
                }
            })
        );

    }
    getUserMonthHistory(date: DjsDate): Observable<ActivityRecord[]> {
        
        const start = date.clone().date(1).hour(0).minute(0).second(0).millisecond(0)
        const end = start.clone().add(1, "month");
        const request = this.api.listDocuments(this.collectionId, 
            [Query.and([Query.greaterThan('date', start.toISOString()), Query.lessThan('date', end.toISOString())])]
        )
        const result = request.then((result) => result.documents.map((doc) => this.parseDocument(doc)))
        return from(result);
    }
    
    downsertRecord(record: ActivityRecord): Observable<ActivityRecord> {
        if(record.number > 1){
            const request = this.api.updateDocument(this.collectionId, record.id, {amount: record.number - 1 });
            const response = request.then((doc) => this.parseDocument(doc));
            return from(response);
        }
        else {
            const request = this.api.deleteDocument(this.collectionId, record.id);
            return from(request).pipe(
                map((_) => ({
                    ...record,
                    number: 0,
                }))
            )
        }
        
    }
}