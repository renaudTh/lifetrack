import { Observable } from "rxjs";
import { Activity } from "./activity";
import { InjectionToken } from "@angular/core";


export const ACTIVITY_PROVIDER = new InjectionToken<IActivityProvider>("activity.provider.interface");

export interface IActivityProvider {
    addActivity(activity:  Partial<Activity>): Observable<Activity>;
    updateActivity(activity: Partial<Activity>): Observable<Activity>
    getActivity(id: string): Observable<Activity>;
    getAllActivities(): Observable<Activity[]>;
}