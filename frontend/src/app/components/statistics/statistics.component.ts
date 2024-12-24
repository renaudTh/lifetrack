import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartData, ChartOptions } from 'chart.js';
import dayjs from 'dayjs';
import { ChartModule } from 'primeng/chart';
import { map, Observable, take } from 'rxjs';
import { generateChartsData } from '../../../domain/chart.service';

import { RecordProviderService } from '../../../providers/record.provider.service';
import { selectAllActivities } from '../../stores/activities-store';
import { ActivityMinimalComponent } from "../activity-minimal/activity-minimal.component";
import { HeaderComponent } from "../header/header.component";
import { Activity, ActivityStats, StatsEngine } from '@lifetrack/lib';

import weekOfYear from 'dayjs/plugin/weekOfYear';
@Component({
    selector: 'app-statistics',
    imports: [HeaderComponent, AsyncPipe, ActivityMinimalComponent, ChartModule],
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.scss',
    providers: [RecordProviderService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent {

  private readonly store = inject(Store);
  private statsEngine: StatsEngine;


  public chartData = signal<ChartData<'line'> | null>(null);
  public chartOptions = signal<ChartOptions<'line'> | null>(null);


  protected activities$ = this.store.select(selectAllActivities);
  protected stats$: Observable<ActivityStats[]>;

  constructor(){
    dayjs.extend(weekOfYear)
    const sampling = "week"
    const start = dayjs().subtract(12, sampling);
    const end = dayjs();
    this.statsEngine = new StatsEngine(start, end, sampling);
    this.stats$ = this.provider.getRecordsBetweenDates(start, end).pipe(map((records) => this.statsEngine.compute(records)));

  }


  private readonly provider = inject(RecordProviderService);

  loadActivityStats(activity: Activity){
    this.stats$.pipe(
      take(1),
      map((values) => {
        const toDisplay = values.find((item) => item.activityId === activity.id);
        return generateChartsData(activity, toDisplay!, this.statsEngine.generateSampleKeys());
      }))
      .subscribe(([data, options]) => {

        this.chartData.set(data);
        this.chartOptions.set(options);
      })
  
  }
}
