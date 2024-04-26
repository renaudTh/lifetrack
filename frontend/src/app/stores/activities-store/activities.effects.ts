import { Inject, Injectable } from "@angular/core";
import { ACTIVITY_PROVIDER, IActivityProvider } from "../../../domain/activity.provider.interface";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ActivitiesActions } from "./activities.actions";
import { EMPTY, catchError, exhaustMap, map, switchMap, withLatestFrom } from "rxjs";
import { UserProviderService } from "../../../providers/user.provider.service";

@Injectable()
export class ActivitiesEffects {

    loadActivities$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ActivitiesActions.loadUserActivities),
            withLatestFrom(this.userService.getUser$()),
            exhaustMap(([_, user]) => this.activitiesProvider.getAllActivitiesSUP(user!.id).pipe(
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
            withLatestFrom(this.userService.getUser$()),
            switchMap(([{activity}, user]) => this.activitiesProvider.addActivity(activity, user!.id).pipe(
                map((activity) => ActivitiesActions.addNewActivitySuccess({activity})),
                catchError((err: any) =>{
                    console.error(err);
                    return EMPTY;
                })
            ))
        )
    )


    constructor( private actions$: Actions,private userService: UserProviderService, @Inject(ACTIVITY_PROVIDER) private activitiesProvider: IActivityProvider){}
}