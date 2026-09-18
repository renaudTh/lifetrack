import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Daily } from './daily';
import { testProviders } from '../../testing/test-providers';

describe('Daily', () => {
  let component: Daily;
  let fixture: ComponentFixture<Daily>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Daily],
      providers: testProviders(),
    }).compileComponents();

    fixture = TestBed.createComponent(Daily);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
