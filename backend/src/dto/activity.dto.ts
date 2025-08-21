import { Activity } from "@lifetrack/lib";

export type ActivityDto = Omit<Activity, 'id'>;
export type ActivityDeleteDto = Pick<Activity, "id">;
export type ActivityUpdateDto = Pick<Activity, "id"> & Partial<Activity>;


export type TopActivity = Activity & { score: number };