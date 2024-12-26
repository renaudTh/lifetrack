import { ChangeDetectionStrategy, Component, computed, input, output, ViewChild } from '@angular/core';



import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ActivityRecord } from '@lifetrack/lib';
import { Chip } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';


@Component({
    selector: 'app-merged-record-minimal',
    imports: [CommonModule, TooltipModule, Chip, BadgeModule, OverlayBadgeModule],
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
  
  @ViewChild('chip') chip!: Chip;

  protected _onDelete(event: MouseEvent){
    event.stopImmediatePropagation();
    event.preventDefault();
    event.stopPropagation();
    this.chip.visible = true;
    this.onDelete.emit(this.record());
  }
}
