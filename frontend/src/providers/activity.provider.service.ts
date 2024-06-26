import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { IActivityProvider } from "../domain/activity.provider.interface";
import { Activity } from "../domain/activity";


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
            description: "Play the piano"
        },
        {
            id: "3",
            representation: "🏃‍♂️",
            amount: 2,
            unit:  "km",
            description: "Running"
        },
        {
            id: "4",
            representation: "🍺",
            amount: 25,
            unit:  "cl",
            description: "Drink a beer"
        },
        {
            id: "6",
            representation: "🍕",
            amount: 1,
            unit:  "u",
            description: "Eat a pizza"
        },

    ];
    private _activitiesSubject = new BehaviorSubject<Activity[]>(this._activities);


    addActivity(activityDto: Partial<Activity>): Observable<Activity> {
        const id = this._activities.length.toString();
        const activity:Activity = {
            id: id,
            amount: activityDto.amount!,
            description: activityDto.description!,
            representation: activityDto.representation!,
            unit: activityDto.unit!
        }
        this._activities = [...this._activities, activity];
        this._activitiesSubject.next(this._activities);
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
        return this._activitiesSubject.asObservable();
    }

}