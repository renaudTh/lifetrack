import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DateService } from '../../../domain/date.service';
import { Day } from '../../../domain/date';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {




  getClassList(day: Day){
    return [!day.inCurrentMonth ? 'not-current-month' : '', day.currentDate ? 'current-date' : '', day.selected ? 'selected' : ''];
  }

  constructor(private dateService: DateService){
  }
  
  protected displayedDateString$ = this.dateService.displayedDateString$;
  protected daysOfMoth$ = this.dateService.daysOfCurrentMonth$;

  previous(){
    this.dateService.previousMonth();
  }
  next(){
    this.dateService.nextMonth();
  }
  selectDay(day: Date){
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
