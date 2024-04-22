import { Activity } from "../domain/activity";

export interface RecordDto  {
    id?: string,
    date?: Date,
    activity: Activity, 
    number: number

}