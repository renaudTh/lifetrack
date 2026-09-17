import dayjs from 'dayjs';
import {
  ActivityStats,
  ActivityStatsDTO,
  HistoryStats,
  HistoryStatsDTO,
} from './models/stats.model';

const DATE_FORMAT = 'YYYY-MM-DD';

export function toHistoryStatsDTO(history: HistoryStats): HistoryStatsDTO {
  return {
    ...history,
    start: history.start.format(DATE_FORMAT),
    end: history.end.format(DATE_FORMAT),
    stats: history.stats.map(
      (stat): ActivityStatsDTO => ({
        ...stat,
        last: stat.last.format(DATE_FORMAT),
      }),
    ),
  };
}

export function fromHistoryStatsDTO(dto: HistoryStatsDTO): HistoryStats {
  return {
    ...dto,
    start: dayjs(dto.start),
    end: dayjs(dto.end),
    stats: dto.stats.map(
      (stat): ActivityStats => ({ ...stat, last: dayjs(stat.last) }),
    ),
  };
}
