import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ActivityRecord } from '@lifetrack/lib';

@Component({
  selector: 'app-record',
  imports: [],
  templateUrl: './record.html',
  styleUrl: './record.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class Record {

  public onDelete = output<ActivityRecord>();

  recordSignal = input.required<ActivityRecord>({ 'alias': "record" })
  tooltipSignal = computed(() => {
    const r = this.recordSignal();
    return `${r.activity.description} : ${r.activity.amount * r.number} ${r.activity.unit}`
  })

  protected downsert() {
    this.onDelete.emit(this.recordSignal());
  }
}
