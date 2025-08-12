import { DjsDate } from "./date.model";


export interface Activity{
    id: string;
    unit: string;
    amount: number;
    representation: string;
    description: string;
}

export interface ActivityRecord {
    id: string;
    activity: Activity;
    date: DjsDate;
    number: number
}

export type ActivityRecordDTO = Omit<ActivityRecord, 'date'> & {date: string};

export interface ActivityStats {
    activityId: string,
    data: number[]
}