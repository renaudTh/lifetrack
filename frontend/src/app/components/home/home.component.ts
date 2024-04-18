import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { EMPTY, Subject, catchError, combineLatest, filter, firstValueFrom, map, mergeMap, takeUntil } from 'rxjs';
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
import { selectAllActivities } from '../../stores/activities-store';
import { UserProvider } from '../../../providers/user.provider.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ActivityMinimalComponent, MergedRecordMinimalComponent, ButtonModule, SpeedDialModule, CalendarComponent, AddActivityButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [UserProvider]
})
export class HomeComponent implements OnDestroy, OnInit {
  private destroy$ = new Subject();

  constructor(private dateService: DateService, 
    private store: Store<RecordState>,
    private userProvider: UserProvider
  
  ){
    this.dateService.displayedDate$.pipe(takeUntil(this.destroy$)).subscribe((date) => {
      this.store.dispatch(RecordsActions.loadDisplayedDateRecords({userId: "8f7f2bdb-3529-4f65-808b-8cd8f81e2269", date}))
    })
    this.store.dispatch(ActivitiesActions.loadUserActivities({ userId: "8f7f2bdb-3529-4f65-808b-8cd8f81e2269"}));
  }
  async ngOnInit(): Promise<void> {
      this.userProvider.login("t.renaud@neuf.fr", "azerty$").pipe(
        catchError((error:any) => {
          return EMPTY;
        })
      ).subscribe((user) => {
        console.log(user);
      })
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
  
  async onDelete(record: RecordDto){
    this.store.dispatch(RecordsActions.downsertRecord({userId: "", record}));
  }
}
