import { Activity, ActivityRecord, DjsDate } from '@lifetrack/lib';
import { Inject, Injectable } from '@nestjs/common';
import { CallingContext } from './domain/calling.context';
import type { IRepoService } from './domain/repo.service.interface';
import { REPO_SERVICE } from './domain/repo.service.interface';
import {
  ActivityDeleteDto,
  ActivityDto,
  ActivityUpdateDto,
} from './dto/activity.dto';
@Injectable()
export class AppService {
  constructor(@Inject(REPO_SERVICE) private readonly repo: IRepoService) {}

  async getActivities(ctx: CallingContext): Promise<Activity[]> {
    return this.repo.getActivities(ctx.userId);
  }
  public async addActivity(
    ctx: CallingContext,
    dto: ActivityDto,
  ): Promise<Activity> {
    const toSave: Activity = {
      ...dto,
      id: crypto.randomUUID(),
    };
    const saved = await this.repo.saveActivity(ctx.userId, toSave);
    return saved;
  }
  public async getTopActivities(
    ctx: CallingContext,
    count: number,
  ): Promise<Activity[]> {
    return this.repo.getTopActivities(ctx.userId, count);
  }

  public async updateActivity(
    ctx: CallingContext,
    dto: ActivityUpdateDto,
  ): Promise<Activity> {
    const toUpdate = await this.repo.getActivity(ctx.userId, dto.id);
    if (toUpdate === null) {
      throw new Error('Activity not found!');
    }
    const newVersion: Activity = { ...toUpdate, ...dto };
    return await this.repo.updateActivity(ctx.userId, newVersion);
  }
  public async deleteActivity(
    ctx: CallingContext,
    dto: ActivityDeleteDto,
  ): Promise<void> {
    return await this.repo.deleteActivity(ctx.userId, dto.id);
  }
  async getRecords(ctx: CallingContext, start: DjsDate, end: DjsDate) {
    return this.repo.getHistory(
      ctx.userId,
      start.format('YYYY-MM-DD'),
      end.format('YYYY-MM-DD'),
    );
  }
  async addRecord(
    ctx: CallingContext,
    date: DjsDate,
    activityId: string,
  ): Promise<ActivityRecord> {
    const activityExists = await this.repo.getActivity(ctx.userId, activityId);
    if (!activityExists) {
      throw new Error('Activity not found !');
    }
    const recordExists = await this.repo.getRecordByActivityAndDate(
      ctx.userId,
      date,
      activityId,
    );
    const record: ActivityRecord =
      recordExists !== null
        ? { ...recordExists, number: recordExists.number + 1 }
        : {
            id: crypto.randomUUID(),
            activity: activityExists,
            date,
            number: 1,
          };
    await this.repo.saveRecord(record, ctx.userId);
    return record;
  }

  async downsertRecord(
    ctx: CallingContext,
    recordId: string,
  ): Promise<ActivityRecord | null> {
    const record = await this.repo.getRecordById(ctx.userId, recordId);
    if (!record) {
      throw new Error('Record not found!');
    }
    if (record.number > 1) {
      const updated: ActivityRecord = { ...record, number: record.number - 1 };
      await this.repo.saveRecord(updated, ctx.userId);
      return updated;
    } else {
      await this.repo.deleteRecord(recordId);
      return null;
    }
  }
}
