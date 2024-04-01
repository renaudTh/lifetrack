import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { Activity } from '../../../domain/activity';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-activity-minimal',
  standalone: true,
  imports: [ChipModule, TooltipModule],
  template: '<p-chip [label]="activity.representation" [pTooltip]="description" [removable]="deletable" (click)="_onClick(activity)" (onRemove)="onRemove(activity.id)"></p-chip>',
  styles: `
    p-chip{
      cursor: pointer;
    }
  `
})
export class ActivityMinimalComponent {

  @Input() activity!: Activity;
  @Input() deletable: boolean = false;
  @Output() onClick = new EventEmitter<Activity>();

  get description() {
    return `${this.activity.description} (${this.activity.amount} ${this.activity.unit})` 
  }

  onRemove(id: string){
    console.log("remove this", id)
  }

  protected _onClick(activity: Activity){
    this.onClick.emit(activity);
  }
}
