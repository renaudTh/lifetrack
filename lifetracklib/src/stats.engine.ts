import { ActivityRecord } from './models/activity.model';
import { DateSampling, DjsDate } from './models/date.model';
import { ActivityStats, HistoryStats } from './models/stats.model';

const SAMPLINGS: readonly DateSampling[] = ['day', 'week', 'month', 'year'];

export function getSampleKey(date: DjsDate, sampling: DateSampling): string {
  switch (sampling) {
    case 'day':
      return date.format('YYYY-MM-DD');
    case 'week':
      // Uniquement du dayjs "core" : un plugin etendu ici porterait sur la copie
      // de dayjs de la lib, pas sur celle qui a cree les dates de l'appelant.
      return date.startOf('week').format('YYYY-MM-DD');
    case 'month':
      return date.format('YYYY-MM');
    case 'year':
      return date.format('YYYY');
  }
}

export function generateSampleKeys(
  start: DjsDate,
  end: DjsDate,
  sampling: DateSampling,
): Set<string> {
  const res = new Set<string>();
  let date = start.clone();
  // Sans ce garde, un sampling inconnu n'avance pas la date et boucle a l'infini.
  if (!SAMPLINGS.includes(sampling)) {
    throw new Error(`Unknown sampling: ${String(sampling)}`);
  }
  res.add(getSampleKey(date, sampling));
  if (end.isBefore(start)) {
    throw new Error('End date is before start date !');
  }
  while (!date.isSame(end, sampling)) {
    date = date.add(1, sampling);
    res.add(getSampleKey(date, sampling));
  }
  return res;
}

export class StatsEngine {
  private groupped = new Map<string, ActivityRecord[]>();
  constructor(
    private start: DjsDate,
    private end: DjsDate,
    private records: ActivityRecord[],
  ) {
    this.records.forEach((record) => {
      const key = record.activity.id;
      const exists = this.groupped.get(key);
      this.groupped.set(key, exists ? [...exists, record] : [record]);
    });
  }

  public computeStats(sampling: DateSampling): HistoryStats {
    const buckets = [...generateSampleKeys(this.start, this.end, sampling)];
    const bucketIndexes = new Map(buckets.map((key, index) => [key, index]));

    const history = [...this.groupped.values()].flatMap(
      (records): ActivityStats[] => {
        if (records.length < 1) return [];
        const activity = records[0].activity;
        const last = records.toSorted(
          (a, b) => b.date.unix() - a.date.unix(),
        )[0].date;
        const cumsum = records.reduce((acc, curr) => acc + curr.number, 0);
        const total = cumsum * activity.amount;

        const series = new Array<number>(buckets.length).fill(0);
        records.forEach((record) => {
          const index = bucketIndexes.get(getSampleKey(record.date, sampling));
          // Un record hors de [start, end] n'appartient a aucun bucket.
          if (index === undefined) return;
          series[index] += record.number * activity.amount;
        });

        return [
          {
            activity,
            cumsum,
            total,
            average: total / buckets.length,
            last,
            series,
          },
        ];
      },
    );

    return {
      start: this.start,
      end: this.end,
      sampling,
      buckets,
      stats: history.toSorted((a, b) => b.total - a.total),
    };
  }
}
