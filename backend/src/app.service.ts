import { Inject, Injectable } from '@nestjs/common';
import { REPO_SERVICE } from './domain/repo.service.interface';
import type { IRepoService } from './domain/repo.service.interface';
import { CallingContext } from './domain/calling.context';
import { Activity, ActivityRecord, DjsDate } from '@lifetrack/lib';
@Injectable()
export class AppService {


  constructor(@Inject(REPO_SERVICE) private readonly repo: IRepoService) { }

  getActivities(ctx: CallingContext): Promise<Activity[]> {
    return this.repo.getActivities(ctx.userId);
  }
  async getRecords(ctx: CallingContext, start: DjsDate, end: DjsDate){
    return this.repo.getHistory(ctx.userId, start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
  }
  async addRecord(ctx: CallingContext, date: DjsDate, activityId: string): Promise<ActivityRecord> {
    const activityExists = await this.repo.getActivity(ctx.userId, activityId);
    if(!activityExists){
      throw new Error("Activity not found !")
    }
    const recordExists = await this.repo.getRecordByActivityAndDate(ctx.userId, date, activityId);
    const record: ActivityRecord = recordExists !== null ? { ...recordExists, number: recordExists.number + 1 } : {
      id: crypto.randomUUID(),
      activity: activityExists,
      date,
      number: 1
    };
    await this.repo.saveRecord(record, ctx.userId);
    return record;
  }

  async downsertRecord(ctx: CallingContext, recordId: string): Promise<ActivityRecord | null> {
    const record = await this.repo.getRecordById(ctx.userId, recordId);
    if(!record){
      throw new Error("Record not found!");
    }
    if(record.number > 1){
      const updated: ActivityRecord = {...record, number: record.number - 1};
      await this.repo.saveRecord(updated, ctx.userId);
      return updated;
    }
    else {
      await this.repo.deleteRecord(recordId);
      return null;
    }
  }
}

