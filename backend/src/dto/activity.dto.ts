import { Activity } from "@lifetrack/lib";

export type ActivityDto = Omit<Activity, 'id'>;