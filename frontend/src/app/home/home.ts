import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Activity } from '@lifetrack/lib';
import { DateService } from '../../domain/date.service';
import { StateService } from '../../domain/state.service';
import { ActivityForm } from "../activity-form/activity-form";
import { ActivityPicker } from "../activity-picker/activity-picker";
import { Calendar } from "../calendar/calendar";
import { Daily } from "../daily/daily";
import { RecentActivities } from "../recent-activities/recent-activities";

@Component({
  selector: 'app-home',
  imports: [Calendar, Daily, RecentActivities, ActivityPicker, ActivityForm],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class Home implements OnInit {

  private readonly authService = inject(AuthService)
  private readonly state = inject(StateService)
  private readonly dateService = inject(DateService)

  public activitiesSignal = this.state.selectActivities;

  protected displayPicker = model<boolean>(false);
  protected displayForm = model<boolean>(false);
  protected activityToEdit = signal<Activity | null>(null);
  constructor() {
    this.displayForm.subscribe((v) => {
      if (!v) {
        this.activityToEdit.set(null);
      }
    })
  }
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
  openActivityForm() {
    this.activityToEdit.set(null);
    this.displayForm.set(true);
  }
  openActivityPicker() {
    this.displayPicker.set(true);

  }
  editActivity(a: Activity) {
    this.displayForm.set(true);
    this.activityToEdit.set(a);
  }

}
