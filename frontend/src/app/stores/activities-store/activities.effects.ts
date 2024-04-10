import { Inject, Injectable } from "@angular/core";
import { ACTIVITY_PROVIDER, IActivityProvider } from "../../../domain/activity.provider.interface";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ActivitiesActions } from "./activities.actions";
import { EMPTY, catchError, map, switchMap } from "rxjs";

@Injectable()
export class ActivitiesEffects {

    loadActivities$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ActivitiesActions.loadUserActivities),
            switchMap(({userId} ) => this.activitiesProvider.getAllActivities().pipe(
                map((activities) => ActivitiesActions.loadingSuccess({activities})),
                catchError((err: any) =>{

                    console.error(err);
                    return EMPTY;
                })
            ))
        )
    )


    constructor( private actions$: Actions, @Inject(ACTIVITY_PROVIDER) private activitiesProvider: IActivityProvider){}
}