import { Component, inject, OnInit, signal } from '@angular/core';
import { API_PROVIDER } from '../../domain/api.provider.interface';
import dayjs from 'dayjs';
import { ActivityComponent } from '../activity-component/activity-component';

@Component({
  selector: 'app-statistics-page',
  imports: [ActivityComponent],
  templateUrl: './statistics-page.html',
  styleUrl: './statistics-page.scss',
})
export class StatisticsPage implements OnInit {
  private api = inject(API_PROVIDER);
  public loading = signal<boolean>(true);
  public lines: any[] = [];
  async ngOnInit(): Promise<void> {
    const end = dayjs();
    const start = end.subtract(1, 'year');
    const stats = await this.api.getHistoryStats(start, end);

    const samples = stats.samplings;

    this.lines = stats.stats
      .map((stat) => {
        const activity = stat.activity;
        const dm =
          samples.day !== 0
            ? `${((stat.cumsum * activity.amount) / samples.day).toFixed(1)}`
            : ' - ';
        const wm =
          samples.week !== 0
            ? `${((stat.cumsum * activity.amount) / samples.week).toFixed(1)}`
            : ' - ';
        const mm =
          samples.month !== 0
            ? `${((stat.cumsum * activity.amount) / samples.month).toFixed(1)}`
            : ' - ';
        const ym =
          samples.year !== 0
            ? `${((stat.cumsum * activity.amount) / samples.year).toFixed(1)}`
            : ' - ';

        return {
          activity: stat.activity,
          cumsum: stat.cumsum * activity.amount,
          dayAvg: dm,
          weekAvg: wm,
          monthAvg: mm,
          yearAvg: ym,
        };
      })
      .sort((a, b) => b.cumsum - a.cumsum);
    this.loading.set(false);
  }
}
