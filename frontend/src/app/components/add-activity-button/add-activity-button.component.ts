import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { Activity, ActivityRecord } from '../../../domain/activity';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
import { ChipModule } from 'primeng/chip';
import { IRecordProvider, RECORD_PROVIDER } from '../../../domain/record.provider.interface';
import { firstValueFrom, mergeMap, take } from 'rxjs';
import { DateService } from '../../../domain/date.service';
@Component({
  selector: 'app-add-activity-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, SpeedDialModule, ActivityMinimalComponent,  ChipModule],
  templateUrl: './add-activity-button.component.html',
  styleUrl: './add-activity-button.component.scss'
})
export class AddActivityButtonComponent {
  
  @Input() activities: Activity[] | null = [];

  constructor(private dateService: DateService,@Inject(RECORD_PROVIDER) private recordProvider: IRecordProvider){}

  async addActivity(activity: Activity){
    const obs = this.dateService.selectedDate$.pipe(mergeMap((date) => {
      const record:ActivityRecord = {
        id: "test",
        activity: activity,
        date: date
      }
      return this.recordProvider.saveRecord(record)
    }))
    await firstValueFrom(obs)
  }
}
