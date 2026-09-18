import { ComponentFixture, TestBed } from '@angular/core/testing';

import dayjs from 'dayjs';
import { DateService } from '../../domain/date.service';
import { Calendar } from './calendar';
import { testProviders } from '../../testing/test-providers';

describe('Calendar', () => {
  let component: Calendar;
  let fixture: ComponentFixture<Calendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calendar],
      providers: testProviders(),
    }).compileComponents();

    fixture = TestBed.createComponent(Calendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const cells = () =>
    (fixture.nativeElement as HTMLElement).querySelectorAll('.cell');

  it('reuses the day cells when the selection changes', () => {
    const before = cells()[10];

    TestBed.inject(DateService).selectDate(dayjs().date(15));
    fixture.detectChanges();

    // Si le track change d'identite a chaque rendu, Angular recree les 42
    // boutons : le calendrier clignote et le focus est perdu.
    expect(cells()[10]).toBe(before);
  });

  it('moves the selected class onto the newly selected day', () => {
    const target = dayjs().date(15);

    TestBed.inject(DateService).selectDate(target);
    fixture.detectChanges();
    const selected = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.selected',
    );

    expect(selected.length).toBe(1);
  });
});
