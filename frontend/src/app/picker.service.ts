import { computed, Injectable, signal } from '@angular/core';
import { Activity } from '@lifetrack/lib';

@Injectable()
export class PickerService {
  private _displayForm = signal<boolean>(false);
  private _displayPicker = signal<boolean>(false);

  public readonly displayPicker = computed(() => this._displayPicker());
  public readonly displayForm = computed(() => this._displayForm());

  closeForm() {
    this._displayForm.set(false);
  }
  openForm(activity: Activity | null) {
    this._displayForm.set(true);
  }
  openPicker() {
    this._displayPicker.set(true);
  }
  closePicker() {
    this._displayPicker.set(false);
  }
}
