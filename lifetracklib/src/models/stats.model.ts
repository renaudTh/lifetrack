import { Activity } from './activity.model';
import { DateSampling, DjsDate } from './date.model';

export type HistoryStats = {
  start: DjsDate;
  end: DjsDate;
  sampling: DateSampling;
  /** Cles de periode couvrant [start, end], dans l'ordre chronologique. */
  buckets: string[];
  stats: ActivityStats[];
};

export interface ActivityStats {
  activity: Activity;
  /** Somme brute des quantites enregistrees. */
  cumsum: number;
  /** cumsum rapporte a l'unite de l'activite. */
  total: number;
  /** total divise par le nombre de periodes couvertes. */
  average: number;
  last: DjsDate;
  /** Une valeur par bucket, meme longueur et meme ordre que HistoryStats.buckets. */
  series: number[];
}

/** Ce qui transite reellement sur le reseau : les dates y sont des chaines ISO. */
export type ActivityStatsDTO = Omit<ActivityStats, 'last'> & { last: string };

export type HistoryStatsDTO = Omit<HistoryStats, 'start' | 'end' | 'stats'> & {
  start: string;
  end: string;
  stats: ActivityStatsDTO[];
};
