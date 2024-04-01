import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
export interface Day {
  date: Date;
  inCurrentMonth: boolean;
  currentDate?: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  private currentDate = new Date();
  private displayedDate = new Date();
  public selectedDate: Date | null = null;
  
  @Output() onSelect = new EventEmitter<Date>();


  get title() {
    return this.displayedDate.toLocaleDateString('en-US', { month: 'long', year: "numeric"});
  }

  get dayList(){
    const list = this.generateDaysOfMonth(this.displayedDate);
    return list;
  }

  getClassList(day: Day){
    const isSelected = day.date.toLocaleDateString() === this.selectedDate?.toLocaleDateString()
    return [!day.inCurrentMonth ? 'not-current-month' : '', day.currentDate ? 'current-date' : '', isSelected ? 'selected' : ''];
  }
  constructor(){
    this.displayedDate.setDate(1);
    this.displayedDate.setMonth(this.displayedDate.getMonth());
    this.displayedDate.setFullYear(this.currentDate.getFullYear());

    this.selectedDate = new Date();
  }

  previous(){
    const month = this.displayedDate.getMonth()
    this.displayedDate.setMonth(month - 1);
  }
  next(){
    
    const month = this.displayedDate.getMonth()
    this.displayedDate.setMonth(month + 1); 
  }
  isToday(date: Date){
    return date.toDateString() === new Date().toDateString();
  }
  get canNext(): boolean {
    
    const displayedMonth = this.displayedDate.getMonth();
    const displayedYear = this.displayedDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();
    const currentYear = this.currentDate.getFullYear();
    if(displayedYear < currentYear) return true;
    if(displayedYear === currentYear){
      return (displayedMonth + 1) <= currentMonth;
    }
    return false;
  }
  selectDay(date: Date){
    this.selectedDate = date;
    this.onSelect.emit(date)
  }

  generateDaysOfMonth(date: Date): Day[] {

    const result: Day[] = [];
    let _date = new Date(date);

    // We want to begin on Monday
    while(_date.getDay() !== 1){
      const dayNumber = _date.getDate(); 
        _date.setDate(dayNumber - 1);
        result.unshift({date: new Date(_date), inCurrentMonth: false, currentDate:this.isToday(_date)  });
      }
      // Reset to the beginning of the month
     _date = new Date(date);
      while (_date.getMonth() === date.getMonth()) {
      const dayNumber = _date.getDate();
      result.push({ date: new Date(_date), inCurrentMonth: true, currentDate:this.isToday(_date) });
      _date.setDate(dayNumber + 1);
    }
    //We want to end on sunday
    while (_date.getDay() !== 1) {
      const dayNumber = _date.getDate();
      result.push({ date: new Date(_date), inCurrentMonth: false, currentDate:this.isToday(_date) });
      _date.setDate(dayNumber + 1);
    }
    return result;
  }
}
