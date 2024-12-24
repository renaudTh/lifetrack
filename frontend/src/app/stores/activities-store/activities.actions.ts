import { Activity } from "@lifetrack/lib";
import { createActionGroup, emptyProps, props } from "@ngrx/store";


export const ActivitiesActions = createActionGroup({
    source: 'Activities',
    events: {    
        'Load User Activities': emptyProps(),
        'Loading Success': props<{activities: Activity[]}>(),
        'Add New Activity': props<{ activity: Partial<Activity>}>(),
        'Add new activity Success': props<{activity: Activity}>(),
    },
  });