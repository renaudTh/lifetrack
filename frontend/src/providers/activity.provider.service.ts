import { Client, Databases, ID, Models } from "appwrite";
import { from, Observable } from "rxjs";
import { IActivityProvider } from "../domain/activity.provider.interface";
import { inject } from "@angular/core";
import { ApiService } from "./api.service";
import { Activity } from "@lifetrack/lib";


export class ActivityProviderService implements IActivityProvider {

    private readonly api = inject(ApiService);
    private collectionId = '675db0bb003314cb9055';

    private parseDocument(doc: Models.Document) : Activity {
        return {
            amount: doc['base_amount'],
            description: doc["description"],
            id: doc.$id,
            representation: doc['representation'],
            unit: doc["unit"]
        }
    }
    addActivity(activity: Partial<Activity>): Observable<Activity> {
        const body: any = {
            "description": activity.description,
            "base_amount": activity.amount,
            "representation": activity.representation,
            "unit": activity.unit,
        }
        const request = this.api.createDocument(this.collectionId, ID.unique(), body);
        const response = request.then((doc: Models.Document) => this.parseDocument(doc));
        return from(response);
    }
    updateActivity(activity: Partial<Activity>): Observable<Activity> {
        throw new Error("Method not implemented.");
    }
    getActivity(id: string): Observable<Activity> {
        throw new Error("Method not implemented.");
    }
    getAllActivities(): Observable<Activity[]> {
        const request = this.api.listDocuments(this.collectionId);
        const response = request.then((value: Models.DocumentList<Models.Document>) => 
           value.documents.map((doc) => this.parseDocument(doc))
        )
        return from(response);
    }
}