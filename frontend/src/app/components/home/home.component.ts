import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { ACTIVITY_PROVIDER, IActivityProvider } from '../../../domain/activity.provider.interface';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
import { AddActivityButtonComponent } from '../add-activity-button/add-activity-button.component';
import { CalendarComponent } from '../calendar/calendar.component';
export interface Day {
  date: Date;
  inCurrentMonth: boolean;
  currentDate?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ActivityMinimalComponent, ButtonModule, SpeedDialModule, CalendarComponent, AddActivityButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  private _selectedDate: Date = new Date();
  constructor(@Inject(ACTIVITY_PROVIDER) private activityProvider: IActivityProvider){
    
  }
  protected activities$ = this.activityProvider.getAllActivities();


  onSelectDate(date: Date){
    console.log(date)
    this._selectedDate = date;
  }
  
  get selectedDate(){
    return this._selectedDate.toLocaleDateString("en-US", {weekday: "long", month: "long", day: "2-digit"});
  }
  
}
