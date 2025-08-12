import { Activity } from "@lifetrack/lib";

export type ActivityDto = Omit<Activity, "id">;
export type ActivityDeleteDto = Pick<Activity, "id">;