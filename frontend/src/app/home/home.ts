import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Activity } from '@lifetrack/lib';
import { activities } from '../../domain/activities';
import { DateService } from '../../domain/date.service';
import { StateService } from '../../domain/state.service';
import { Calendar } from "../calendar/calendar";
import { Daily } from "../daily/daily";
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [Calendar, Daily, KeyValuePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  private readonly authService = inject(AuthService)
  private readonly state = inject(StateService)
  private readonly dateService = inject(DateService)


  public activitiesSignal = this.state.selectActivities;

  ngOnInit(): void {
    const sortedDisplayed = this.dateService.daysOfCurrentMonth().map((d) => d.date).sort((a, b) => a.isBefore(b) ? -1 : 1);
    const start = sortedDisplayed[0];
    const end = sortedDisplayed[sortedDisplayed.length - 1];
    this.state.loadHistory(start, end);
    this.state.loadActivities();
  }
  login() {
    this.authService.loginWithRedirect();
  }


  upsertActivity(activity: Activity) {
    this.state.recordActivity(activity)
  }
}
