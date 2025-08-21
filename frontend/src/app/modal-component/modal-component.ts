import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';

@Component({
  selector: 'app-modal-component',
  imports: [],
  templateUrl: './modal-component.html',
  styleUrl: './modal-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ModalComponent {

  public visible = model<boolean>(false);

  protected modalClasses = computed(() => {
    const opened = this.visible();
    if (opened) return ["modal", "is-active"];
    return ["modal"]
  })

  close() {
    this.visible.set(false);
  }
}
