import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Activity } from "../../../domain/activity";

export const ActivitiesActions = createActionGroup({
    source: 'Activities',
    events: {    
        'Load User Activities': emptyProps(),
        'Loading Success': props<{activities: Activity[]}>(),
        'Add New Activity': props<{ activity: Partial<Activity>}>(),
        'Add new activity Success': props<{activity: Activity}>(),
    },
  });