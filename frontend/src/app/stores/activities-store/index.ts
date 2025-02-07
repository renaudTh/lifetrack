import { Activity } from "@lifetrack/lib";
import { createFeatureSelector, createSelector } from "@ngrx/store";



export interface ActivitiesState {
    [id: string]: Activity;
}

const selectActivitiesFeature = createFeatureSelector<ActivitiesState>('activities');
export const selectAllActivities = createSelector(
    selectActivitiesFeature,
    (activities: ActivitiesState) => Object.values(activities)
)

export const selectFive = createSelector(
    selectAllActivities,
    (activities: Activity[]) => activities.slice(0,5)
)