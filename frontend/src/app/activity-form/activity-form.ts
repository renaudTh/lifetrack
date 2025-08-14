import { Component, inject, model } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityDto } from '../../domain/activities';
import { StateService } from '../../domain/state.service';
import { ModalComponent } from '../modal-component/modal-component';
@Component({
  selector: 'app-activity-form',
  imports: [ModalComponent, ReactiveFormsModule],
  templateUrl: './activity-form.html',
  styleUrl: './activity-form.scss'
})
export class ActivityForm {

  visible = model<boolean>(false);

  private readonly state = inject(StateService);


  activityForm = new FormGroup({
    representation: new FormControl<string>('', { validators: [Validators.required] }),
    base_amount: new FormControl('', { validators: [Validators.required] }),
    description: new FormControl('', { validators: [Validators.required] }),
    unit: new FormControl('', { validators: [Validators.required] })
  });

  close() {
    this.visible.set(false);
  }

  addActivity() {

    if (this.activityForm.invalid) return;
    const form = this.activityForm.value;
    const activity: ActivityDto = {
      amount: parseInt(form.base_amount!),
      description: form.description!,
      representation: form.representation!,
      unit: form.unit!
    }
    this.state.addActivity(activity);
    this.visible.set(false);
    this.activityForm.reset();
  }
}
