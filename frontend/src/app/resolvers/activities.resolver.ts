import { ResolveFn } from "@angular/router";
import { Observable } from "rxjs";
import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { ActivitiesActions } from "../stores/activities-store/activities.actions";
import { selectAllActivities } from "../stores/activities-store";
import { Activity } from "@lifetrack/lib";

export const activitiesResolver: ResolveFn<Activity[]> = (
    route,
    state
  ): Observable<Activity[]> => {
    const store = inject(Store);
    store.dispatch(ActivitiesActions.loadUserActivities());
    return store.select(selectAllActivities);
  };