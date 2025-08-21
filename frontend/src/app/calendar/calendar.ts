import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Day, DjsDate } from '@lifetrack/lib';
import { DateService } from '../../domain/date.service';
import { StateService } from '../../domain/state.service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class Calendar {


  private readonly dateService = inject(DateService)
  private readonly state = inject(StateService);
  protected displayedMonth = this.dateService.currentMonthString;
  protected daysOfMonth = this.dateService.daysOfCurrentMonth;

  getClassList(day: Day) {
    if (day.selected) return ['selected']
    if (!day.inCurrentMonth) return ['not-in-current-month']
    if (day.currentDate) return ['current-date']
    return ['in-current-month']
  }

  previous() {
    this.dateService.previousMonth();
    const sortedDisplayed = this.dateService.daysOfCurrentMonth().map((d) => d.date).sort((a, b) => a.isBefore(b) ? -1 : 1);
    const start = sortedDisplayed[0];
    const end = sortedDisplayed[sortedDisplayed.length - 1];
    this.state.loadHistory(start, end);
  }
  next() {
    this.dateService.nextMonth();
    const sortedDisplayed = this.dateService.daysOfCurrentMonth().map((d) => d.date).sort((a, b) => a.isBefore(b) ? -1 : 1);
    const start = sortedDisplayed[0];
    const end = sortedDisplayed[sortedDisplayed.length - 1];
    this.state.loadHistory(start, end);
  }
  selectDay(day: DjsDate) {
    this.dateService.selectedDate = day;
  }
  get canNext(): boolean {

    return true;
  }


}
