import { Activity, ActivityRecord, DjsDate } from "@lifetrack/lib";

export const REPO_SERVICE = "repo.service.interface"
export interface IRepoService {

    getActivities(userId: string): Promise<Activity[]>
    getActivity(userId: string, activityId: string): Promise<Activity | null>;
    saveActivity(userId: string, activity: Activity): Promise<Activity>;
    deleteActivity(userId: string, activityId: string): Promise<void>;
    updateActivity(userId: string, activity: Activity): Promise<Activity>;
    getTopActivities(userId: string, count: number): Promise<Activity[]>;
    getHistory(userId: string, start: string, end: string): Promise<ActivityRecord[]>
    getRecordByActivityAndDate(userId: string, date: DjsDate, activityId: string): Promise<ActivityRecord | null>
    getRecordById(userId: string, recordId: string): Promise<ActivityRecord | null>;
    saveRecord(record: ActivityRecord, userId: string): Promise<ActivityRecord>;
    deleteRecord(recordId: string): Promise<void>;
}