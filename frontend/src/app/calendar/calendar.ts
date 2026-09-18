import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Day, DjsDate } from '@lifetrack/lib';
import { DateService } from '../../domain/date.service';
import { StateService } from '../../domain/state.service';

function classesOf(day: Day): string {
  if (day.selected) return 'cell selected';
  if (!day.inCurrentMonth) return 'cell not-in-current-month';
  if (day.currentDate) return 'cell current-date';
  return 'cell in-current-month';
}

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar {
  private readonly dateService = inject(DateService);
  private readonly state = inject(StateService);

  protected displayedMonth = this.dateService.currentMonthString;

  /** Classes are derived here: called from the template, they would be
   * recomputed on every cycle for each of the 42 cells. */
  protected days = computed(() =>
    this.dateService.daysOfCurrentMonth().map((day) => ({
      day,
      classes: classesOf(day),
      label: day.date.format('D'),
      key: day.date.format('YYYY-MM-DD'),
    })),
  );

  previous() {
    this.dateService.previousMonth();
    this.loadDisplayedRange();
  }

  next() {
    this.dateService.nextMonth();
    this.loadDisplayedRange();
  }

  selectDay(day: DjsDate) {
    this.dateService.selectDate(day);
  }

  private loadDisplayedRange(): void {
    const displayed = this.days().map((entry) => entry.day.date);
    if (displayed.length === 0) return;
    this.state.loadHistory(displayed[0], displayed[displayed.length - 1]);
  }
}
