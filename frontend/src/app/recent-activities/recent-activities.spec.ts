import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentActivities } from './recent-activities';
import { testProviders } from '../../testing/test-providers';

describe('RecentActivities', () => {
  let component: RecentActivities;
  let fixture: ComponentFixture<RecentActivities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentActivities],
      providers: testProviders(),
    }).compileComponents();

    fixture = TestBed.createComponent(RecentActivities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
