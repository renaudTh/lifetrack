import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { selectFive } from '../../stores/activities-store';
import { RecordsActions } from '../../stores/record-store/record.actions';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
import { ActivityPickerComponent } from '../activity-picker/activity-picker.component';
import { Activity } from '@lifetrack/lib';


@Component({
    selector: 'app-add-activity-button',
    imports: [CommonModule, ButtonModule, ActivityMinimalComponent],
    templateUrl: './add-activity-button.component.html',
    styleUrl: './add-activity-button.component.scss',
    providers: [DialogService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddActivityButtonComponent {


  private readonly store = inject(Store);
  private readonly dialogService = inject(DialogService);
  
  protected fiveLast$ = this.store.select(selectFive)

  async addActivity(activity: Activity) {
    this.store.dispatch(RecordsActions.upsertRecord({activity: activity}))
  }

  openDialog() {
    this.dialogService.open(ActivityPickerComponent, { header: "My activities", width: '95vw', height: '50vh', position: 'top', modal: false });
  }
}
