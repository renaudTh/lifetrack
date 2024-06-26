import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { Activity } from '../../../domain/activity';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-activity-minimal',
  standalone: true,
  imports: [ChipModule, TooltipModule],
  template: '<p-chip [label]="activity.representation" [pTooltip]="description" [removable]="removable" (click)="_onClick(activity)" (onRemove)="onRemove()"></p-chip>',
  styles: `
    p-chip{
      cursor: pointer;
    }
  `
})
export class ActivityMinimalComponent {

  @Input() activity!: Activity;
  @Input() deletable: boolean | null = false;
  @Output() onClick = new EventEmitter<Activity>();
  @Output() onDelete = new EventEmitter<Activity>();
  get description() {
    return `${this.activity.description} (${this.activity.amount} ${this.activity.unit})` 
  }

  get removable(){
    if(this.deletable === null) return false;
    else return this.deletable
  }
  onRemove(){
    this.onDelete.emit(this.activity);
  }

  protected _onClick(activity: Activity){
    this.onClick.emit(activity);
  }
}
