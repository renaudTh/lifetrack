import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Activity } from "src/domain/activity";
import { IActivityProvider } from "src/domain/activity.provider.interface";

@Injectable()
export class ActivityProviderService implements IActivityProvider {

    private _activities: Activity[] = [
        {
            id: "0",
            representation: "🚴‍♂️",
            amount: 4,
            unit: "km",
            description: "cycling"
        },
        {
            id: "1",
            representation: "🍔",
            amount: 1,
            unit: "u",
            description: "Eat a burger"
        },
        {
            id: "2",
            representation: "🎹",
            amount: 30,
            unit:  "min",
            description: "30 min of playing the piano"
        }
    ];


    addActivity(activity: Activity): Observable<Activity> {
        const id = this._activities.length.toString();
        activity.id = id;
        this._activities = [...this._activities, activity];
        return of(activity);
    }
    updateActivity(activity: Partial<Activity>): Observable<Activity> {
        throw new Error("Method not implemented.");
    }
    getActivity(id: string): Observable<Activity> {
        const activity = this._activities.find((activity) => activity.id === id);
        if(!activity) throw new Error("Activity not found");
        return of(activity);
    }
    getAllActivities(): Observable<Activity[]> {
        return of(this._activities);
    }

}