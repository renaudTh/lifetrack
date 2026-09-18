import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityComponent } from './activity-component';
import { testProviders } from '../../testing/test-providers';

describe('ActivityComponent', () => {
  let component: ActivityComponent;
  let fixture: ComponentFixture<ActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityComponent],
      providers: testProviders(),
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityComponent);
    fixture.componentRef.setInput('activity', {
      id: 'a1',
      unit: 'min',
      amount: 30,
      representation: 'P',
      description: 'Piano',
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
