import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";
import { Activity } from "@lifetrack/lib";


export const ACTIVITY_PROVIDER = new InjectionToken<IActivityProvider>("activity.provider.interface");

export interface IActivityProvider {
    addActivity(activity:  Partial<Activity>): Observable<Activity>;
    updateActivity(activity: Partial<Activity>): Observable<Activity>
    getActivity(id: string): Observable<Activity>;
    getAllActivities(): Observable<Activity[]>;
}