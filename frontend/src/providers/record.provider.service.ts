import { Client, Databases, ID, Models, Query } from "appwrite";
import { from, map, Observable, switchMap } from "rxjs";
import { ActivityRecord } from "../domain/activity";
import { IRecordProvider } from "../domain/record.provider.interface";
import { RecordDto } from "./record.dto";
import { inject } from "@angular/core";
import { ApiService } from "./api.service";

export class RecordProviderService implements IRecordProvider {


    private readonly api = inject(ApiService);
    private collectionId = '675db2c70024c64a4934';
    
    constructor(){
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
            date: new Date(doc['date']),
            id: doc.$id,
            number: doc["amount"]
        }
    }

    upsertRecord(recordDto: RecordDto): Observable<ActivityRecord> {
        //Get all daily records
        const start = new Date(recordDto.date);
        start.setHours(0,0,0,0);
        const end = new Date(recordDto.date);
        end.setHours(23,59,999);

        const recordsRequest = this.api.listDocuments(
            this.collectionId,
            [Query.and([Query.lessThan('date', end.toISOString()),Query.greaterThan('date', start.toISOString())])]
        );
        const recordsResult = recordsRequest.then((r) => r.documents.map((doc) => this.parseDocument(doc)));        
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
    getUserMonthHistory(userId: string, date: Date): Observable<ActivityRecord[]> {
        
        const month = date.getMonth();
        const year = date.getFullYear();
        const start = new Date(year, month, 1).toISOString();
        const end = new Date(year, month+1, 1).toISOString();

        const request = this.api.listDocuments(this.collectionId, 
            [Query.and([Query.greaterThan('date', start), Query.lessThan('date', end)])]
        )
        const result = request.then((result) => result.documents.map((doc) => this.parseDocument(doc)))
        return from(result);
    }
    downsertRecord(userId: string, record: ActivityRecord): Observable<ActivityRecord> {
        
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