import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityPicker } from './activity-picker';
import { testProviders } from '../../testing/test-providers';

describe('ActivityPicker', () => {
  let component: ActivityPicker;
  let fixture: ComponentFixture<ActivityPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityPicker],
      providers: testProviders(),
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityPicker);
    fixture.componentRef.setInput('visible', true);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
