import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Activity } from '../../../domain/activity';
import { selectFive } from '../../stores/activities-store';
import { RecordsActions } from '../../stores/record-store/record.actions';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
import { ActivityPickerComponent } from '../activity-picker/activity-picker.component';


@Component({
  selector: 'app-add-activity-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, ActivityMinimalComponent, ActivityPickerComponent],
  templateUrl: './add-activity-button.component.html',
  styleUrl: './add-activity-button.component.scss',
  providers: [DialogService],
})
export class AddActivityButtonComponent {

 
  private _dialogRef: DynamicDialogRef | undefined;
  
  protected fiveLast$ = this.store.select(selectFive)
  constructor(
    private dialogService: DialogService,
    private store: Store,
  ) {

  }

  async addActivity(activity: Activity) {
    this.store.dispatch(RecordsActions.upsertRecord({activity}))
  }

  openDialog() {
    this._dialogRef = this.dialogService.open(ActivityPickerComponent, { header: "My activities", width: '95vw', height: '50vh', position: 'top', modal: false });
  }
}
