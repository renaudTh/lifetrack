import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { Activity } from '../../../domain/activity';
import { ActivityMinimalComponent } from '../activity-minimal/activity-minimal.component';
@Component({
  selector: 'app-add-activity-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, SpeedDialModule, ActivityMinimalComponent],
  templateUrl: './add-activity-button.component.html',
  styleUrl: './add-activity-button.component.scss'
})
export class AddActivityButtonComponent implements OnInit {
  
  @Input() activities: Activity[] | null = [];
  protected left: Activity[] = [];
  protected right: Activity[] = [];
  toggle: boolean = false;
  
  
  ngOnInit(): void {
    if(this.activities){
      const mid = this.activities.length / 2;
      this.left = this.activities.slice(0, mid);
      this.right = this.activities.slice(mid, this.activities.length);
    }
  }
  toggleRecent(){
      this.toggle = !this.toggle;
  }

  addActivity(activity: Activity){
    console.log(activity);
  }
}
