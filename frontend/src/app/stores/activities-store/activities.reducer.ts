import { createReducer, on } from "@ngrx/store";
import { ActivitiesState } from ".";
import { ActivitiesActions } from "./activities.actions";

export const initialActivitiesState: ActivitiesState = {}

export const activitiesReducer = createReducer(
    initialActivitiesState,
    on(ActivitiesActions.loadingSuccess, (_state, {activities}) => activities.reduce((obj, item) => ({ ...obj, [item.id]: item }), {}))
);