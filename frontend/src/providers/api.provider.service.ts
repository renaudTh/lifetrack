import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Activity, ActivityRecord, ActivityRecordDTO, DjsDate } from "@lifetrack/lib";
import dayjs from "dayjs";
import { firstValueFrom } from "rxjs";
import { ILifetrackApi } from "../domain/api.provider.interface";

export class ApiProvider implements ILifetrackApi {


    private readonly http = inject(HttpClient);

    public async getActivities(): Promise<Activity[]> {
        const request = this.http.get<Activity[]>(`api://activities`);
        return firstValueFrom(request);
    }
    public async getHistory(start: DjsDate, end: DjsDate): Promise<ActivityRecord[]> {
        const sp = start.format("YYYY-MM-DD");
        const ep = end.format("YYYY-MM-DD");
        const request = this.http.get<ActivityRecordDTO[]>(`api://records?start=${sp}&end=${ep}`);
        const dtos = await firstValueFrom(request);
        return dtos.map(dto => ({ ...dto, date: dayjs(dto.date) }))
    }

    public async recordActivity(activity: Activity, date: DjsDate): Promise<ActivityRecord> {
        const request = this.http.post<ActivityRecordDTO>(`api://record`, { activityId: activity.id, date: date.format("YYYY-MM-DD") })
        const r = await firstValueFrom(request);
        return { ...r, date: dayjs(r.date) }
    }

    public async downsertRecord(record: ActivityRecord): Promise<ActivityRecord | null> {
        const request = this.http.patch<ActivityRecordDTO | null>(`api://record/${record.id}`, {});
        const maybe = await firstValueFrom(request);
        return maybe ? { ...maybe, date: dayjs(maybe.date) } : null
    }

}