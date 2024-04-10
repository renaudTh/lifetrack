import { createActionGroup, props } from "@ngrx/store";
import { RecordDto } from "../../../providers/record.dto";
import { Activity, ActivityRecord } from "../../../domain/activity";

export const RecordsActions = createActionGroup({
    source: 'Records',
    events: {    
        'Load Displayed Date Records': props<{userId: string, date: Date}>(),
        'Loading Success': props<{userMonth: ActivityRecord[]}>(),
        'Upsert Record': props<{userId: string, activity: Activity}>(),
        'Upsert Success': props<{record: ActivityRecord}>(),
        'Downsert Record': props<{userId: string, record: RecordDto}>(),
        'Downsert Success': props<{record: ActivityRecord}>()
    },
  });


