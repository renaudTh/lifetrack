import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityPickerComponent } from './activity-picker.component';

describe('ActivityManagerComponent', () => {
  let component: ActivityPickerComponent;
  let fixture: ComponentFixture<ActivityPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
