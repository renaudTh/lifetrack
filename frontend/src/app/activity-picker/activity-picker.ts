import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, model, output, signal } from '@angular/core';
import { Activity } from '@lifetrack/lib';
import { StateService } from '../../domain/state.service';
import { ActivityComponent } from '../activity-component/activity-component';
import { ModalComponent } from '../modal-component/modal-component';

@Component({
  selector: 'app-activity-picker',
  imports: [ModalComponent, ActivityComponent, KeyValuePipe],
  templateUrl: './activity-picker.html',
  styleUrl: './activity-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ActivityPicker {

  private readonly state = inject(StateService)
  protected activitiesSignal = this.state.selectActivities;

  protected editMode = signal<boolean>(false);
  visible = model.required<boolean>();
  edit = output<Activity>();

  constructor() {
    this.visible.subscribe((v) => {
      if (!v) this.editMode.set(false)
    })
  }

  protected dialogTitle = computed(() => {
    const e = this.editMode();
    const base = "Pick an activity"
    return e ? `${base} to edit` : `${base} to record`;
  })

  protected editButton = computed(() => {
    const e = this.editMode();
    return e ? "Cancel" : "Edit"
  })

  protected onEdit() {
    const e = this.editMode();
    this.editMode.set(!e);
  }
  protected upsertActivity(activity: Activity) {
    this.state.recordActivity(activity);

  }

  protected editActivity(a: Activity) {
    this.visible.set(false);
    this.edit.emit(a);
  }
}
