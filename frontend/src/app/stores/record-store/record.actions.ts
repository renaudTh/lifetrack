import { createActionGroup, props } from "@ngrx/store";
import { Activity, ActivityRecord } from "../../../domain/activity";
import { DjsDate } from "../../../domain/date";

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


