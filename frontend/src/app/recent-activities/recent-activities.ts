import { KeyValuePipe } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { Activity } from '@lifetrack/lib';
import { StateService } from '../../domain/state.service';
import { ActivityForm } from "../activity-form/activity-form";
import { ModalComponent } from "../modal-component/modal-component";

@Component({
  selector: 'app-recent-activities',
  imports: [KeyValuePipe, ModalComponent, ActivityForm],
  templateUrl: './recent-activities.html',
  styleUrl: './recent-activities.scss'
})
export class RecentActivities {
  private readonly state = inject(StateService)

  protected activitiesSignal = this.state.selectActivities;
  protected openOtherSignal = model<boolean>(false);
  protected openNewSignal = model<boolean>(false);

  upsertActivity(activity: Activity) {
    this.state.recordActivity(activity)
    if (this.openOtherSignal()) {
      this.openOtherSignal.set(false);
    }
  }

  openOther() {
    this.openOtherSignal.set(true);
  }

  closeOther() {
    this.openOtherSignal.set(false);
  }

  openNew() {
    this.openNewSignal.set(true);
  }

  closeNew() {
    this.openNewSignal.set(false);
  }
}
