import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ActivityRecord } from '../../../domain/activity';

import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { RecordDto } from '../../../providers/record.dto';


@Component({
    selector: 'app-merged-record-minimal',
    imports: [CommonModule, TooltipModule],
    templateUrl: './merged-record-minimal.component.html',
    styleUrl: './merged-record-minimal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MergedRecordMinimalComponent {

  public record = input.required<ActivityRecord>()
  public deletable = input<boolean>(false);
  public onDelete = output<ActivityRecord>();
  protected description = computed(() => `${this.record().activity.description} (${this.record().activity.amount * this.record().number} ${this.record().activity.unit})`)
  protected badgeValue = computed(() => this.record().number > 1 ? this.record().number : 0)
  

  protected _onDelete(){
    this.onDelete.emit(this.record());
  }
}
