import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Activity } from '@lifetrack/lib';
import { ActivityDto } from '../../domain/activities';
import { StateService } from '../../domain/state.service';
import { ModalComponent } from '../modal-component/modal-component';
@Component({
  selector: 'app-activity-form',
  imports: [ModalComponent, ReactiveFormsModule],
  templateUrl: './activity-form.html',
  styleUrl: './activity-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityForm {
  visible = model<boolean>(false);
  activity = input<Activity | null>(null);
  private readonly state = inject(StateService);

  submitLabel = computed(() => (this.activity() === null ? `Add` : `Update`));

  dialogTitle = computed(() =>
    this.activity() === null ? `New activity` : `Update activity`,
  );

  displayDelete = computed(() => this.activity() !== null);

  activityForm = computed(() => {
    const a = this.activity();
    const v: any = {
      representation: a != null ? a.representation : '',
      base_amount: a != null ? a.amount : 1,
      description: a != null ? a.description : '',
      unit: a != null ? a.unit : '',
    };
    return new FormGroup({
      representation: new FormControl<string>(v.representation, {
        validators: [Validators.required],
      }),
      base_amount: new FormControl<number>(v.base_amount, {
        validators: [Validators.required],
      }),
      description: new FormControl(v.description, {
        validators: [Validators.required],
      }),
      unit: new FormControl(v.unit, { validators: [Validators.required] }),
    });
  });

  close() {
    this.visible.set(false);
  }
  delete() {
    const form = this.activityForm();
    const a = this.activity();
    if (a === null) return;
    this.state.deleteActivity(a);
    this.visible.set(false);
    form.reset();
  }

  addOrUpdate() {
    const form = this.activityForm();
    if (form.invalid) return;
    const value = form.value;
    const dto: ActivityDto = {
      amount: value.base_amount!,
      description: value.description!,
      representation: value.representation!,
      unit: value.unit!,
    };
    if (this.activity() === null) {
      this.addActivity(dto);
    } else {
      this.updateActivity(dto);
    }
    this.visible.set(false);
    form.reset();
  }
  private updateActivity(dto: ActivityDto) {
    const a = this.activity();
    const activity: Activity = {
      ...dto,
      id: a!.id,
    };
    this.state.updateActivity(activity);
  }
  private addActivity(dto: ActivityDto) {
    this.state.addActivity(dto);
  }
}
