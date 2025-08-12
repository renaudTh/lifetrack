import { InjectionToken } from "@angular/core";
import { Activity, ActivityRecord, ActivityRecordDTO, DjsDate } from "@lifetrack/lib";


export const API_PROVIDER = new InjectionToken<ILifetrackApi>("lifetrack.api.provider");

export interface ILifetrackApi {


    getHistory(sart: DjsDate, end: DjsDate): Promise<ActivityRecord[]>;
    getActivities(): Promise<Activity[]>;
    recordActivity(activity: Activity, date: DjsDate): Promise<ActivityRecord>;
    downsertRecord(record: ActivityRecord): Promise<ActivityRecord | null>;
}