
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Day, DjsDate } from '../../../domain/date';
import { DateService } from '../../../domain/date.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent {

  private readonly dateService = inject(DateService)
  protected displayedDateString$ = this.dateService.displayedDateString$;
  protected daysOfMonth$ = this.dateService.daysOfCurrentMonth$;
 
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
    
    // const displayedMonth = this.displayedDate.getMonth();
    // const displayedYear = this.displayedDate.getFullYear();
    // const currentMonth = this.currentDate.getMonth();
    // const currentYear = this.currentDate.getFullYear();
    // if(displayedYear < currentYear) return true;
    // if(displayedYear === currentYear){
    //   return (displayedMonth + 1) <= currentMonth;
    // }
    return true;
  }
 

  
}
