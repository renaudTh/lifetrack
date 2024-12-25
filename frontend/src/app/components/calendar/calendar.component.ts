
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DateService } from '../../../domain/date.service';
import { Day, DjsDate } from '@lifetrack/lib';


@Component({
    selector: 'app-calendar',
    imports: [CommonModule, ButtonModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent {

  private readonly dateService = inject(DateService)
  protected displayedMonth = this.dateService.currentMonthString;
  protected daysOfMonth = this.dateService.daysOfCurrentMonth;
 
  getClassList(day: Day){
    return [!day.inCurrentMonth ? 'not-current-month' : '', day.currentDate ? 'current-date' : '', day.selected ? 'selected' : ''];
  }  

  previous(){
    this.dateService.previousMonth();
  }
  next(){
    this.dateService.nextMonth();
  }
  selectDay(day: DjsDate){
    this.dateService.selectedDate = day;
  }
  get canNext(): boolean {
    
    return true;
  }
 

  
}
