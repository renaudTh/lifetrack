import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { ACTIVITY_PROVIDER, IActivityProvider } from '../../../domain/activity.provider.interface';
import { CommonModule } from '@angular/common';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
import { DateService } from '../../../domain/date.service';
import { Activity } from '../../../domain/activity';
import { firstValueFrom, mergeMap } from 'rxjs';
import { RecordDto } from '../../../providers/record.dto';
import { IRecordProvider, RECORD_PROVIDER } from '../../../domain/record.provider.interface';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-picker',
  standalone: true,
  imports: [CommonModule,ActivityMinimalComponent, ButtonModule, InputNumberModule, InputTextModule, FormsModule],
  templateUrl: './activity-picker.component.html',
  styleUrl: './activity-picker.component.scss',

})
export class ActivityPickerComponent {

  @Output() onPickActivity = new EventEmitter<Activity>();

  constructor(@Inject(ACTIVITY_PROVIDER) private activitiesProvider: IActivityProvider, 
            ){}
  protected activities$ = this.activitiesProvider.getAllActivities();
  
  protected _selectActivity(activity: Activity){
    this.onPickActivity.emit(activity);
  }
}
