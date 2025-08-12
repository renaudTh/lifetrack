import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Day, DjsDate } from '@lifetrack/lib';
import { DateService } from '../../domain/date.service';
import { StateService } from '../../domain/state.service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar {


  private readonly dateService = inject(DateService)
  private readonly state = inject(StateService);
  protected displayedMonth = this.dateService.currentMonthString;
  protected daysOfMonth = this.dateService.daysOfCurrentMonth;

  getClassList(day: Day) {
    if (day.selected) return ['has-background-primary-bold', 'has-text-primary-bold-invert']
    if (!day.inCurrentMonth) return ['has-background-grey-lighter']
    if (day.currentDate) return ['has-background-primary-50']
    return ['has-background-primary-90']
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
