import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ACTIVITY_PROVIDER, IActivityProvider } from '../../../domain/activity.provider.interface';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
import { ButtonModule } from 'primeng/button';

export interface Day {
  number: number;
  name: string;
  inCurrentMonth: boolean;
  currentDate?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ActivityMinimalComponent, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private currentDate = new Date();
  private displayedDate = new Date();
  public selected: Day | null = null;

  get title() {
    return this.displayedDate.toLocaleDateString('en-US', { month: 'long', year: "numeric"});
  }

  get dayList(){
    const list = this.generateDaysOfMonth(this.displayedDate);
    return list;
  }

  getClassList(day: Day){
    const isSelected = JSON.stringify(day) === JSON.stringify(this.selected);
    return [!day.inCurrentMonth ? 'not-current-month' : '', day.currentDate ? 'current-date' : '', isSelected ? 'selected' : ''];
  }
  constructor(@Inject(ACTIVITY_PROVIDER) private activityProvider: IActivityProvider){
    this.displayedDate.setDate(1);
    this.displayedDate.setMonth(this.displayedDate.getMonth());
    this.displayedDate.setFullYear(this.currentDate.getFullYear());
    console.log(this.currentDate.toDateString());
  }

  previous(){
    const month = this.displayedDate.getMonth()
    this.displayedDate.setMonth(month - 1);
    // console.log(this.displayedDate.toLocaleDateString());
  }
  next(){
    
    const month = this.displayedDate.getMonth()
    this.displayedDate.setMonth(month + 1); 
    // console.log(this.displayedDate.toLocaleDateString());
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
  selectDay(day: Day){
    this.selected = day;
    console.log("selected: ", this.selected);
  }
  generateDaysOfMonth(date: Date): Day[] {

    const result: Day[] = [];
    let _date = new Date(date);

    _date.setDate(_date.getDate()-1)
    // We want to begin on Monday
    while(_date.getDay() !== 0){
        const dayNumber = _date.getDate(); 
        _date.setDate(dayNumber - 1);
        const dayName = _date.toLocaleDateString('en-US', { weekday: 'long' });
        result.unshift({ number: dayNumber, name: dayName, inCurrentMonth: false, currentDate:this.isToday(_date)  });
      }
      // Reset to the beginning of the month
     _date = new Date(date);
      while (_date.getMonth() === date.getMonth()) {
      const dayNumber = _date.getDate();
      const dayName = _date.toLocaleDateString('en-US', { weekday: 'long' });
      result.push({ number: dayNumber, name: dayName, inCurrentMonth: true, currentDate:this.isToday(_date) });
      _date.setDate(dayNumber + 1);
    }
    //We want to end on sunday
    while (_date.getDay() !== 1) {
      const dayNumber = _date.getDate();
      _date.setDate(dayNumber + 1);
      const dayName = _date.toLocaleDateString('en-US', { weekday: 'long' });
      result.push({ number: dayNumber, name: dayName, inCurrentMonth: false, currentDate:this.isToday(_date) });
    }
    return result;
  }

  
}
