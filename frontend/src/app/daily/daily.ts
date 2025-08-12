import { Component, computed, inject } from '@angular/core';
import { ActivityRecord } from '@lifetrack/lib';
import dayjs from 'dayjs';
import { DateService } from '../../domain/date.service';
import { StateService } from '../../domain/state.service';
import { Record } from "../record/record";
@Component({
  selector: 'app-daily',
  imports: [Record],
  templateUrl: './daily.html',
  styleUrl: './daily.scss'
})
export class Daily {

  private readonly dateService = inject(DateService)
  private readonly state = inject(StateService);

  public recordsSignal = this.state.selectDaily;

  protected selectedDateSignal = computed(() => {
    const current = this.dateService.selectedDateSignal();
    return dayjs(current).format("MMMM DD YYYY")
  });

  downsert(record: ActivityRecord) {
    this.state.downRecord(record);
  }
}
