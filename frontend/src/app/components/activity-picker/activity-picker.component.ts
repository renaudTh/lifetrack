import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Activity } from '../../../domain/activity';
import { ACTIVITY_PROVIDER, IActivityProvider } from '../../../domain/activity.provider.interface';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
import { RecordState } from '../../record-store';
import { Store } from '@ngrx/store';
import { RecordsActions } from '../../record-store/record.actions';
import { DateService } from '../../../domain/date.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-activity-picker',
  standalone: true,
  imports: [CommonModule,ActivityMinimalComponent, ButtonModule, InputNumberModule, InputTextModule, FormsModule],
  templateUrl: './activity-picker.component.html',
  styleUrl: './activity-picker.component.scss',

})
export class ActivityPickerComponent {

  @Output() onPickActivity = new EventEmitter<Activity>();

  constructor(@Inject(ACTIVITY_PROVIDER) private activitiesProvider: IActivityProvider, private dateService: DateService, private store: Store<RecordState>
            ){}
  protected activities$ = this.activitiesProvider.getAllActivities();
  async addActivity(activity: Activity) {
      this.store.dispatch(RecordsActions.upsertRecord({userId: "", activity}))
  }
}
