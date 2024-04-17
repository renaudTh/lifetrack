import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, catchError, from, map, of, tap } from "rxjs";
import { IActivityProvider } from "../domain/activity.provider.interface";
import { Activity } from "../domain/activity";
import { PostgrestResponse, SupabaseClient } from "@supabase/supabase-js";


@Injectable()
export class ActivityProviderService implements IActivityProvider {

   
    constructor(@Inject("SUPABASE_CLIENT") private _supabase: SupabaseClient){}

    //TODO: typing
    addActivity(activityDto: Partial<Activity>, userId: string): Observable<Activity> {
        return from(this._supabase.from('activities').insert(
        [{
            user_id: userId,
            representation: activityDto.representation,
            description: activityDto.description,
            unit: activityDto.unit,
            amount: activityDto.amount
        }]
       ).select()).pipe(
            map((response: PostgrestResponse<any>) => {
                if(response.error !== null || response.data === null){
                    throw new Error("impossible to add activity");
                }
                return response.data[0];
            }),
            map((data):Activity => ({
                amount: data.amount,
                description: data.desription,
                id: data.id,
                representation: data.representation,
                unit: data.unit
            }) )
       )
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