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
    date: Date;
}