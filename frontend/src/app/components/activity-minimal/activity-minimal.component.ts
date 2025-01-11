import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, Input, output, Output } from '@angular/core';
import { Activity } from '@lifetrack/lib';


import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-activity-minimal',
    imports: [ChipModule, TooltipModule],
    template: `
    <p-chip 
      [label]="activity().representation" 
      [pTooltip]="description()" 
      [removable]="false" 
      (click)="_onClick()">
    </p-chip>
    `
    ,
    styles: `
    p-chip{
      cursor: pointer;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityMinimalComponent {

  public activity = input.required<Activity>();
  
  public onClick = output<Activity>();

  protected description = computed(() => 
    `${this.activity().description} (${this.activity().amount} ${this.activity().unit})` 
  )
  protected _onClick(){
    this.onClick.emit(this.activity());
  }
}
