import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { ACTIVITY_PROVIDER, IActivityProvider } from '../../../domain/activity.provider.interface';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
import { AddActivityButtonComponent } from '../add-activity-button/add-activity-button.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { IRecordProvider, RECORD_PROVIDER } from '../../../domain/record.provider.interface';
import { DateService } from '../../../domain/date.service';
import { map, mergeMap, switchMap } from 'rxjs';
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

  constructor(private dateService: DateService, @Inject(ACTIVITY_PROVIDER) private activityProvider: IActivityProvider, @Inject(RECORD_PROVIDER) private recordProvider: IRecordProvider){
  }

  protected selectedDate$ = this.dateService.selectedDateString$;
  protected activities$ = this.activityProvider.getAllActivities();
  protected daily$ = this.dateService.selectedDate$.pipe(mergeMap((date) => this.recordProvider.getUserDaily("", date)))
  
}
