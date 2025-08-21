import { Activity } from "@lifetrack/lib";


export type TopActivity = Activity & { score: number };
export type ActivityDto = Omit<Activity, "id">;
export type ActivityDeleteDto = Pick<Activity, "id">;