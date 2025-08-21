import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Activity } from '@lifetrack/lib';

@Component({
  selector: 'app-activity-component',
  imports: [],
  templateUrl: './activity-component.html',
  styleUrl: './activity-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityComponent {

  public activity = input.required<Activity>()
  public edition = input<boolean>(false);
  public onEdit = output<Activity>()
  public onClick = output<Activity>()


  click() {
    this.onClick.emit(this.activity());
  }

  edit() {
    this.onEdit.emit(this.activity());
  }

}
