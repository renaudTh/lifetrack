import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityPicker } from './activity-picker';

describe('ActivityPicker', () => {
  let component: ActivityPicker;
  let fixture: ComponentFixture<ActivityPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
