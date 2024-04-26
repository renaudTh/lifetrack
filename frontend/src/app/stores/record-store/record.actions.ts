import { createActionGroup, props } from "@ngrx/store";
import { RecordDto } from "../../../providers/record.dto";
import { Activity, ActivityRecord } from "../../../domain/activity";

export const RecordsActions = createActionGroup({
    source: 'Records',
    events: {    
        'Load Displayed Date Records': props<{date: Date}>(),
        'Loading Success': props<{userMonth: ActivityRecord[]}>(),
        'Upsert Record': props<{activity: Activity}>(),
        'Upsert Success': props<{record: ActivityRecord}>(),
        'Downsert Record': props<{record: ActivityRecord}>(),
        'Downsert Success': props<{record: ActivityRecord}>()
    },
  });


