import { Activity, ActivityRecord } from "@lifetrack/lib";
import { ActivityDBO } from "src/entities/activity.entity";
import { RecordDBO } from "src/entities/record.entity";
import dayjs from 'dayjs'

export function dboToActivity(dbo: ActivityDBO) : Activity {
    return {
        id: dbo.id,
        amount: dbo.base_amount,
        description: dbo.description,
        representation: dbo.representation,
        unit: dbo.unit
    }
}
export type ActivitySaveDBO = Omit<ActivityDBO, "records">

export function activityToSaveDbo(activity: Activity, userId: string): ActivitySaveDBO {
    return {
        base_amount: activity.amount,
        description: activity.description,
        id: activity.id,
        representation: activity.representation,
        unit: activity.unit,
        owner_id: userId
    }
}
export type RecordSaveDBO = Omit<RecordDBO, "activity"> & {activity: ActivitySaveDBO}

export function dboToRecord(dbo: RecordDBO): ActivityRecord {
    return {
        activity: dboToActivity(dbo.activity),
        date: dayjs(dbo.date),
        id: dbo.id,
        number: dbo.count
    }
}
export function recordToSaveDBO(record: ActivityRecord, userId: string): RecordSaveDBO {
    return {
        id: record.id,
        activity: activityToSaveDbo(record.activity, userId),
        count: record.number,
        date: record.date.format("YYYY-MM-DD"),
        userId
    }
}