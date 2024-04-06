import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Activity, ActivityRecord } from '../../../domain/activity';
import { CommonModule } from '@angular/common';
import { RecordDto } from '../../../providers/record.dto';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-merged-record-minimal',
  standalone: true,
  imports: [CommonModule,TooltipModule],
  template: `
  
    <div class="chip-wrapper">
        <div class="chip-content" [pTooltip]="description">
            <div class="chip-badge" *ngIf="badgeValue > 1">
                <span>{{badgeValue}}</span>
            </div>
            <div class="chip-delete-badge" *ngIf="deletable" (click)="_onDelete()">
                <i class="pi pi-minus"></i>
            </div>
            <span>{{ record.activity.representation}}</span>
        </div>
    </div>
  `,
  styles: `
    .chip-wrapper{
        width: 4rem;
        height: 3rem;
        box-sizing: border-box;
        // border: 1px solid black;
    }
    .chip-content{
        position: relative;
        top: 0.5rem;
        left: 0.5rem;
        background-color: var(--surface-d);
        width: 3rem;
        height: 2rem;
        z-index: 1;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .chip-badge{
        position: absolute;
        left: -0.5rem;
        top: -0.5rem;
        width: 1.25rem;
        height: 1.25rem;
        z-index: 2;

        background-color: var(--primary-color);
        color: var(--primary-color-text);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        border-radius: 50%;
    }
    .chip-delete-badge{
        position: absolute;
        left: 2.125rem;
        top: -0.5rem;
        width: 1.25rem;
        height: 1.25rem;
        z-index: 2;

        background-color: var(--bluegray-500);
        color: var(--primary-color-text);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.25rem;
        border-radius: 50%;
        cursor: pointer;
        i{
        font-size: 0.5rem;

        }
    }
  `
})
export class MergedRecordMinimalComponent {

  @Input() record!: ActivityRecord;
  @Input() deletable: boolean = false;
//   @Output() onClick = new EventEmitter<Activity>();
  @Output() onDelete = new EventEmitter<RecordDto>();
  get description() {
    return `${this.record.activity.description} (${this.record.activity.amount * this.record.number} ${this.record.activity.unit})` 
  }
  get badgeValue(): number {
    return this.record.number > 1 ? this.record.number : 0;
  }

  protected _onDelete(){
    this.onDelete.emit({
        activity: this.record.activity,
        date: this.record.date
    })
  }

  protected _onClick(activity: Activity){
    // this.onClick.emit(activity);
  }
}
