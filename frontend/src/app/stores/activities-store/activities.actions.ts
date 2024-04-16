import { createActionGroup, props } from "@ngrx/store";
import { Activity } from "../../../domain/activity";

export const ActivitiesActions = createActionGroup({
    source: 'Activities',
    events: {    
        'Load User Activities': props<{userId: string}>(),
        'Loading Success': props<{activities: Activity[]}>(),
        'Add New Activity': props<{userId: string, activity: Partial<Activity>}>(),
        'Add new activity Success': props<{activity: Activity}>(),
    },
  });