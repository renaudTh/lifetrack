import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ACTIVITY_PROVIDER, IActivityProvider } from '../../../domain/activity.provider.interface';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';



export interface Day {
  number: number;
  name: string;
  inCurrentMonth: boolean;
  currentDate?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ActivityMinimalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private currentDate = new Date();
  private displayedDate = new Date();

  get title() {
    return this.displayedDate.toLocaleDateString('en-US', { month: 'long', year: "numeric"});
  }

  get dayList(){
    const list = this.generateDaysOfMonth(this.displayedDate);
    return list;
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
