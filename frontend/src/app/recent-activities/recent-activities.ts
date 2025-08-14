import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject, model, signal } from '@angular/core';
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

  protected deleteMode = signal<boolean>(false);


  dialogTitle = computed(() => {
    const del = this.deleteMode();
    const base = "Pick an activity"
    if (del) {
      return `${base} to delete`
    }
    return base;
  })

  buttonClass = computed(() => {
    const base = ["button", "is-medium"]
    const del = this.deleteMode();
    if (del) {
      return [...base, "is-danger", "is-outlined"]
    }
    return base;
  })
  upsertActivity(activity: Activity) {
    if (this.deleteMode()) {
      const want = confirm(`Do you really want to delete ${activity.representation} : ${activity.description} ?`);
      if (want) {
        console.log("delete");
      }
      else {
        console.log("canceled")
      }
      this.deleteMode.set(false);
      this.openOtherSignal.set(false);
      return;
    }
    else {
      this.state.recordActivity(activity)
      if (this.openOtherSignal()) {
        this.openOtherSignal.set(false);
      }
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

  onDelete() {
    this.deleteMode.set(true);
  }
}
