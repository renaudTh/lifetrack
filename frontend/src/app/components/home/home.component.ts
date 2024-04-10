import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { Subject, combineLatest, filter, firstValueFrom, map, mergeMap, takeUntil } from 'rxjs';
import { ACTIVITY_PROVIDER, IActivityProvider } from '../../../domain/activity.provider.interface';
import { DateService } from '../../../domain/date.service';
import { IRecordProvider, RECORD_PROVIDER } from '../../../domain/record.provider.interface';
import { RecordDto } from '../../../providers/record.dto';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
import { AddActivityButtonComponent } from '../add-activity-button/add-activity-button.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { MergedRecordMinimalComponent } from '../merged-record-minimal/merged-record-minimal.component';
import { Store } from '@ngrx/store';
import { RecordsActions } from '../../stores/record-store/record.actions';
import { RecordState, selectAllRecords } from '../../stores/record-store';
import { ActivitiesActions } from '../../stores/activities-store/activities.actions';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ActivityMinimalComponent, MergedRecordMinimalComponent, ButtonModule, SpeedDialModule, CalendarComponent, AddActivityButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy {
  private destroy$ = new Subject();

  constructor(private dateService: DateService, 
    @Inject(ACTIVITY_PROVIDER) private activityProvider: IActivityProvider, 
    @Inject(RECORD_PROVIDER) private recordProvider: IRecordProvider,
    private store: Store<RecordState>
  
  ){
    this.dateService.displayedDate$.pipe(takeUntil(this.destroy$)).subscribe((date) => {
      this.store.dispatch(RecordsActions.loadDisplayedDateRecords({userId: "", date}))
    })
    this.store.dispatch(ActivitiesActions.loadUserActivities({ userId: ""}));
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  protected selectedDate$ = this.dateService.selectedDateString$;
  protected activities$ = this.activityProvider.getAllActivities();
  protected monthly$ = this.store.select(selectAllRecords);
  protected daily$ = combineLatest([this.dateService.selectedDate$, this.monthly$]).pipe(
    map(([date, monthRecords]) => monthRecords.filter((record) => record.date.toDateString() === date.toDateString()))
  )
  
  async onDelete(record: RecordDto){
    this.store.dispatch(RecordsActions.downsertRecord({userId: "", record}));
  }
}
