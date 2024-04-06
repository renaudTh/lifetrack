import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { SpeedDialModule } from 'primeng/speeddial';
import { firstValueFrom, mergeMap } from 'rxjs';
import { Activity } from '../../../domain/activity';
import { DateService } from '../../../domain/date.service';
import { IRecordProvider, RECORD_PROVIDER } from '../../../domain/record.provider.interface';
import { RecordDto } from '../../../providers/record.dto';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
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
      const record: RecordDto = {
        activity: activity,
        date: date
      }
      return this.recordProvider.upsertRecord("", record)
    }))
    await firstValueFrom(obs)
  }
}
