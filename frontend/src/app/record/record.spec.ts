import { ComponentFixture, TestBed } from '@angular/core/testing';
import dayjs from 'dayjs';

import { Record } from './record';
import { testProviders } from '../../testing/test-providers';

describe('Record', () => {
  let component: Record;
  let fixture: ComponentFixture<Record>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Record],
      providers: testProviders(),
    }).compileComponents();

    fixture = TestBed.createComponent(Record);
    fixture.componentRef.setInput('record', {
      id: 'r1',
      activity: {
        id: 'a1',
        unit: 'min',
        amount: 30,
        representation: 'P',
        description: 'Piano',
      },
      date: dayjs('2025-09-01'),
      number: 1,
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
