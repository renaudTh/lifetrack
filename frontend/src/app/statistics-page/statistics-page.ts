import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DateSampling } from '@lifetrack/lib';
import dayjs from 'dayjs';
import { StateService } from '../../domain/state.service';
import { ActivityComponent } from '../activity-component/activity-component';
import { StatsChart } from '../stats-chart/stats-chart';
import { DecimalPipe } from '@angular/common';

const SAMPLINGS: readonly DateSampling[] = ['day', 'week', 'month', 'year'];

const DATE_FORMAT = 'YYYY-MM-DD';

@Component({
  selector: 'app-statistics-page',
  imports: [ActivityComponent, DecimalPipe, StatsChart],
  templateUrl: './statistics-page.html',
  styleUrl: './statistics-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsPage implements OnInit {
  private state = inject(StateService);

  public readonly samplings = SAMPLINGS;
  public readonly stats = this.state.selectStats;

  public readonly start = signal(
    dayjs().subtract(1, 'year').format(DATE_FORMAT),
  );
  public readonly end = signal(dayjs().format(DATE_FORMAT));
  public readonly sampling = signal<DateSampling>('month');

  public readonly rangeIsValid = computed(
    () => !dayjs(this.end()).isBefore(dayjs(this.start())),
  );

  ngOnInit(): void {
    this.reload();
  }

  changeStart(event: Event): void {
    const value = valueOf(event);
    if (value !== undefined) this.start.set(value);
  }

  changeEnd(event: Event): void {
    const value = valueOf(event);
    if (value !== undefined) this.end.set(value);
  }

  changeSampling(event: Event): void {
    const sampling = SAMPLINGS.find(
      (candidate) => candidate === valueOf(event),
    );
    if (sampling === undefined) return;
    this.sampling.set(sampling);
    this.reload();
  }

  reload(): void {
    if (!this.rangeIsValid()) return;
    this.state.loadStats(
      dayjs(this.start()),
      dayjs(this.end()),
      this.sampling(),
    );
  }
}

function valueOf(event: Event): string | undefined {
  const target = event.target;
  if (target instanceof HTMLInputElement) return target.value;
  if (target instanceof HTMLSelectElement) return target.value;
  return undefined;
}
