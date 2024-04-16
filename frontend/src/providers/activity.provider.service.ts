import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, from, map, of } from "rxjs";
import { IActivityProvider } from "../domain/activity.provider.interface";
import { Activity } from "../domain/activity";
import { SupabaseClient } from "@supabase/supabase-js";


@Injectable()
export class ActivityProviderService implements IActivityProvider {

   
    constructor(@Inject("SUPABASE_CLIENT") private _supabase: SupabaseClient){}


    addActivity(activityDto: Partial<Activity>): Observable<Activity> {
        // const id = this._activities.length.toString();
        // const activity:Activity = {
        //     id: id,
        //     amount: activityDto.amount!,
        //     description: activityDto.description!,
        //     representation: activityDto.representation!,
        //     unit: activityDto.unit!
        // }
        // this._activities = [...this._activities, activity];
        // this._activitiesSubject.next(this._activities);
        // return of(activity);
        throw new Error("Method not implemented.");
        
    }
    updateActivity(activity: Partial<Activity>): Observable<Activity> {
        throw new Error("Method not implemented.");
    }
    getActivity(id: string): Observable<Activity> {
        // const activity = this._activities.find((activity) => activity.id === id);
        // if(!activity) throw new Error("Activity not found");
        // return of(activity);
        throw new Error("Method not implemented.");

    }
    getAllActivitiesSUP(userId: string): Observable<Activity[]> {
        return from(this._supabase
        .from('activities')
        .select("*")
        .eq("user_id", userId)).pipe(
            map((response) => {
                if(response.error || !response.data){
                    throw new Error("Impossible to load activities! ");
                }
                return response.data;
            }),
            map((data):Activity[] => data.map((item) => ({
                id: item.id,
                description: item.description,
                amount: item.amount,
                representation: item.representation,
                unit: item.unit
            })))

        )
    }

}