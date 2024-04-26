import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { Subject, combineLatest, map, takeUntil } from 'rxjs';
import { ActivityRecord } from '../../../domain/activity';
import { DateService } from '../../../domain/date.service';
import { UserProviderService } from '../../../providers/user.provider.service';
import { ActivitiesActions } from '../../stores/activities-store/activities.actions';
import { RecordState, selectAllRecords } from '../../stores/record-store';
import { RecordsActions } from '../../stores/record-store/record.actions';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
import { AddActivityButtonComponent } from '../add-activity-button/add-activity-button.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { MergedRecordMinimalComponent } from '../merged-record-minimal/merged-record-minimal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ActivityMinimalComponent, MergedRecordMinimalComponent, ButtonModule, SpeedDialModule, CalendarComponent, AddActivityButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [UserProviderService]
})
export class HomeComponent implements OnDestroy, OnInit {
  private destroy$ = new Subject();

  constructor(private dateService: DateService, 
    private store: Store<RecordState>,
    private userProvider: UserProviderService
  
  ){
    this.dateService.displayedDate$.pipe(takeUntil(this.destroy$)).subscribe((date) => {
      this.store.dispatch(RecordsActions.loadDisplayedDateRecords({date}))
    })
    this.store.dispatch(ActivitiesActions.loadUserActivities());
  }
  async ngOnInit(): Promise<void> {
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  protected selectedDate$ = this.dateService.selectedDateString$;
  protected monthly$ = this.store.select(selectAllRecords);
  protected daily$ = combineLatest([this.dateService.selectedDate$, this.monthly$]).pipe(
    map(([date, monthRecords]) => monthRecords.filter((record) => record.date.toDateString() === date.toDateString()))
  )
  
  async onDelete(record: ActivityRecord){
    this.store.dispatch(RecordsActions.downsertRecord({record}));
  }
}
