import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { switchMap } from 'rxjs';
import { DateService } from '../../../domain/date.service';
import { RecordDto } from '../../../providers/record.dto';
import { ActivitiesActions } from '../../stores/activities-store/activities.actions';
import { RecordState, selectDailyRecord } from '../../stores/record-store';
import { RecordsActions } from '../../stores/record-store/record.actions';
import { AddActivityButtonComponent } from '../add-activity-button/add-activity-button.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { MergedRecordMinimalComponent } from '../merged-record-minimal/merged-record-minimal.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,  MergedRecordMinimalComponent, ButtonModule, SpeedDialModule, CalendarComponent, AddActivityButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  private readonly dateService = inject(DateService);
  private readonly store = inject(Store<RecordState>);

  protected selectedDateString$ = this.dateService.selectedDateString$;

  constructor(){
    //TODO: rework loading of data
    this.dateService.displayedDate$.pipe(takeUntilDestroyed()).subscribe((date) => {
      this.store.dispatch(RecordsActions.loadDisplayedDateRecords({userId: "", date}))
    })
    this.store.dispatch(ActivitiesActions.loadUserActivities({ userId: ""}));
  }

  protected daily$ = this.dateService.selectedDate$.pipe(
   switchMap((date) => this.store.select(selectDailyRecord(date))))

  
  onDelete(record: RecordDto){
    this.store.dispatch(RecordsActions.downsertRecord({userId: "", record}));
  }
}
