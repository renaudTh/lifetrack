
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Activity } from '../../../domain/activity';
import { selectAllActivities } from '../../stores/activities-store';
import { ActivitiesActions } from '../../stores/activities-store/activities.actions';
import { RecordsActions } from '../../stores/record-store/record.actions';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';

@Component({
  selector: 'app-activity-picker',
  standalone: true,
  imports: [CommonModule,ActivityMinimalComponent, ButtonModule, InputTextModule, FormsModule],
  templateUrl: './activity-picker.component.html',
  styleUrl: './activity-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityPickerComponent {

  protected activity: Partial<Activity> = {
    amount: undefined,
    description: "",
    representation: "",
    unit: ""
  }
  private readonly store = inject(Store);
  protected activities$ = this.store.select(selectAllActivities);
 
  async addActivity(activity: Activity) {
      this.store.dispatch(RecordsActions.upsertRecord({userId: "", activity}))
  }
  newActivity(){
    this.store.dispatch(ActivitiesActions.addNewActivity({userId: '', activity: this.activity}));
  }
}
