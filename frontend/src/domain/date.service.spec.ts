import { TestBed } from '@angular/core/testing';
import { DateService } from './date.service';
import { of, take } from 'rxjs';
import dayjs from 'dayjs';



fdescribe('DateService tests', () => {
  let service: DateService

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initial currentDate$ value', () => {
        const expected = dayjs().date(1);
        service.currentMonth$.subscribe((value) => {
            expect(value.isSame(expected, "day")).toBe(true)
        });
  });
  it('initial selectedDate$ value', () => {
    const expected = dayjs();
    service.selectedDate$.subscribe((value) => {
       expect(value.isSame(expected, "day")).toBe(true)
    })
  });
  it("test calendar generation", () => {

    const currentMonth = dayjs("01-01-2024")
    const selected = dayjs("01-15-2024")
    service.generate(currentMonth, selected);
  })


});
