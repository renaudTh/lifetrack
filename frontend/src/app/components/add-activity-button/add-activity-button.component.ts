import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { firstValueFrom, mergeMap, take } from 'rxjs';
import { Activity } from '../../../domain/activity';
import { DateService } from '../../../domain/date.service';
import { IRecordProvider, RECORD_PROVIDER } from '../../../domain/record.provider.interface';
import { RecordDto } from '../../../providers/record.dto';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
import { ActivityPickerComponent } from '../activity-picker/activity-picker.component';
import { Store } from '@ngrx/store';
import { RecordsActions } from '../../stores/record-store/record.actions';


@Component({
  selector: 'app-add-activity-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, ActivityMinimalComponent, ActivityPickerComponent],
  templateUrl: './add-activity-button.component.html',
  styleUrl: './add-activity-button.component.scss',
  providers: [DialogService],
})
export class AddActivityButtonComponent {

  @Input() activities: Activity[] | null = [];
  private _dialogRef: DynamicDialogRef | undefined;

  constructor(private dateService: DateService,
    @Inject(RECORD_PROVIDER) private recordProvider: IRecordProvider,
    private dialogService: DialogService,
    private store: Store,
  ) {

  }

  async addActivity(activity: Activity) {
    this.store.dispatch(RecordsActions.upsertRecord({userId: "", activity: activity}))
  }

  openDialog() {
    this._dialogRef = this.dialogService.open(ActivityPickerComponent, { header: "My activities", width: '95vw', height: '50vh', position: 'top', modal: false });
  }
}
