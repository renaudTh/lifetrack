import { Component, model } from '@angular/core';
import { ModalComponent } from '../modal-component/modal-component';

@Component({
  selector: 'app-activity-form',
  imports: [ModalComponent],
  templateUrl: './activity-form.html',
  styleUrl: './activity-form.scss'
})
export class ActivityForm {

  visible = model<boolean>(false);

  close() {
    this.visible.set(false);
  }
}
