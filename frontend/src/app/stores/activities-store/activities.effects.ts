import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, EMPTY, map, switchMap } from "rxjs";
import { ACTIVITY_PROVIDER } from "../../../domain/activity.provider.interface";
import { ActivitiesActions } from "./activities.actions";

@Injectable()
export class ActivitiesEffects {
    private readonly actions$ = inject(Actions);
    private readonly activitiesProvider = inject(ACTIVITY_PROVIDER);

    loadActivities$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ActivitiesActions.loadUserActivities),
            switchMap((_) => this.activitiesProvider.getAllActivities().pipe(
                map((activities) => ActivitiesActions.loadingSuccess({activities})),
                catchError((err: any) =>{
                    console.error(err);
                    return EMPTY;
                })
            ))
        )
    )

    addActivity$ = createEffect(()=>
        this.actions$.pipe(
            ofType(ActivitiesActions.addNewActivity),
 
            switchMap(({activity}) => {
                return this.activitiesProvider.addActivity( activity).pipe(
                map((activity) => ActivitiesActions.addNewActivitySuccess({activity})),
                catchError((err: any) =>{
                    console.error(err);
                    return EMPTY;
                })
            )})
        )
    )

}