import { Activity, ActivityRecord, DjsDate } from "@lifetrack/lib";
import { createActionGroup, props } from "@ngrx/store";


export const RecordsActions = createActionGroup({
    source: 'Records',
    events: {    
        'Load Displayed Date Records': props<{date: DjsDate}>(),
        'Loading Success': props<{userMonth: ActivityRecord[]}>(),
        'Upsert Record': props<{ activity: Activity}>(),
        'Upsert Success': props<{record: ActivityRecord}>(),
        'Downsert Record': props<{record: ActivityRecord}>(),
        'Downsert Success': props<{record: ActivityRecord}>()
    },
  });


