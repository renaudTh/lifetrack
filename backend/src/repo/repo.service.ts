/* eslint-disable prettier/prettier */
import { Activity, ActivityRecord, DjsDate } from '@lifetrack/lib';
import { InjectDataSource } from '@nestjs/typeorm';
import { RecordDBO } from 'src/entities/record.entity';
import { Between, DataSource, In, Not } from 'typeorm';
import { IRepoService } from '../domain/repo.service.interface';
import { ActivityDBO } from '../entities/activity.entity';
import {
  activityToSaveDbo,
  dboToActivity,
  dboToRecord,
  recordToSaveDBO,
} from './utils';

function activityIdOf(row: unknown): string[] {
  if (typeof row !== 'object' || row === null || !('activityId' in row)) {
    return [];
  }
  return typeof row.activityId === 'string' ? [row.activityId] : [];
}

export class RepoService implements IRepoService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getTopActivities(userId: string, count: number): Promise<Activity[]> {
    const repo = this.dataSource.getRepository(ActivityDBO);

    const query = `SELECT "activityId", SUM("count") AS "total_count" FROM public."Records"
                        WHERE "userId" = $1 
                        GROUP BY "activityId"
                        ORDER BY total_count DESC
                        LIMIT $2`;

    // dataSource.query() rend `any` : on narrow au lieu de l'annoter.
    const rows: unknown = await this.dataSource.query(query, [userId, count]);
    const topIds = Array.isArray(rows) ? rows.flatMap(activityIdOf) : [];

    let activityEntities: ActivityDBO[] = [];
    if (topIds.length > 0) {
      activityEntities = await repo.find({
        where: { id: In(topIds), owner_id: userId },
        relations: [],
      });
    }

    const activityMap = new Map(activityEntities.map((a) => [a.id, a]));
    const sortedActivities = topIds.flatMap((activityId) => {
      const found = activityMap.get(activityId);
      return found === undefined ? [] : [found];
    });
    if (sortedActivities.length < count) {
      const missingCount = count - sortedActivities.length;
      const additional = await repo.find({
        where: { id: Not(In(topIds)), owner_id: userId },
        take: missingCount,
      });
      sortedActivities.push(...additional);
    }
    return sortedActivities.map((a) => dboToActivity(a));
  }
  async updateActivity(userId: string, activity: Activity): Promise<Activity> {
    const repo = this.dataSource.getRepository(ActivityDBO);
    const { id, owner_id, ...fields } = activityToSaveDbo(activity, userId);
    // `save` sur une cle existante ecrirait owner_id : une activite appartenant
    // a quelqu'un d'autre changerait de proprietaire au lieu d'etre ignoree.
    await repo.update({ id, owner_id: owner_id }, fields);
    return activity;
  }
  async deleteActivity(userId: string, activityId: string): Promise<void> {
    const repo = this.dataSource.getRepository(ActivityDBO);
    await repo.softDelete({ owner_id: userId, id: activityId });
  }
  async saveActivity(userId: string, activity: Activity): Promise<Activity> {
    const repo = this.dataSource.getRepository(ActivityDBO);
    const dbo = activityToSaveDbo(activity, userId);
    await repo.save(dbo);
    return activity;
  }

  async deleteRecord(userId: string, recordId: string): Promise<void> {
    const repo = this.dataSource.getRepository(RecordDBO);
    // Le filtre sur l'utilisateur appartient au repo : le faire reposer sur
    // l'ordre des appels du service rendrait n'importe quel record supprimable.
    await repo.delete({ id: recordId, userId: userId });
  }
  async getRecordById(
    userId: string,
    recordId: string,
  ): Promise<ActivityRecord | null> {
    const repo = this.dataSource.getRepository(RecordDBO);
    const dbo = await repo.findOne({
      where: { userId: userId, id: recordId },
      relations: ['activity'],
      withDeleted: true,
    });
    return dbo ? dboToRecord(dbo) : null;
  }
  async getActivity(
    userId: string,
    activityId: string,
  ): Promise<Activity | null> {
    const repo = this.dataSource.getRepository(ActivityDBO);
    const dbo = await repo.findOne({
      where: { owner_id: userId, id: activityId },
    });
    return !dbo ? null : dboToActivity(dbo);
  }
  async saveRecord(
    record: ActivityRecord,
    userId: string,
  ): Promise<ActivityRecord> {
    const dbo = recordToSaveDBO(record, userId);
    const repo = this.dataSource.getRepository(RecordDBO);
    await repo.save(dbo);
    return record;
  }
  async getRecordByActivityAndDate(
    userId: string,
    date: DjsDate,
    activityId: string,
  ): Promise<ActivityRecord | null> {
    const repo = this.dataSource.getRepository(RecordDBO);
    const record = await repo.findOne({
      where: {
        userId: userId,
        date: date.format('YYYY-MM-DD'),
        activity: {
          id: activityId,
        },
      },
      relations: ['activity'],
    });
    if (record === null) return null;
    return dboToRecord(record);
  }

  async getHistory(
    userId: string,
    start: string,
    end: string,
  ): Promise<ActivityRecord[]> {
    const repo = this.dataSource.getRepository(RecordDBO);
    const dbos = await repo.find({
      where: { userId: userId, date: Between(start, end) },
      relations: ['activity'],
      withDeleted: true,
    });
    return dbos.map((dbo) => dboToRecord(dbo));
  }

  async getActivities(userId: string): Promise<Activity[]> {
    const repo = this.dataSource.getRepository(ActivityDBO);
    const dbos = await repo.find({
      where: { owner_id: userId },
      relations: [],
    });
    return dbos.map((dbo) => ({
      amount: dbo.base_amount,
      description: dbo.description,
      id: dbo.id,
      representation: dbo.representation,
      unit: dbo.unit,
    }));
  }
}
