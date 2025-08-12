import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
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
  activitiesSignal = computed(() => Object.fromEntries(Object.entries(this.state.selectActivities()).slice(0, 5)));


  upsertActivity(a: Activity) {
    this.state.recordActivity(a);
  }
}
