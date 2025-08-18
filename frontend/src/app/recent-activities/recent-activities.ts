import { KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Activity } from '@lifetrack/lib';
import { StateService } from '../../domain/state.service';
import { ActivityComponent } from '../activity-component/activity-component';

@Component({
  selector: 'app-recent-activities',
  imports: [KeyValuePipe, ActivityComponent],
  templateUrl: './recent-activities.html',
  styleUrl: './recent-activities.scss'
})
export class RecentActivities {

  private readonly state = inject(StateService);
  activitiesSignal = this.state.selectTopActivities


  upsertActivity(a: Activity) {
    this.state.recordActivity(a);
  }
}
