import dayjs from 'dayjs';
import { Calendar } from '../calendar';
import { Day } from '../models/date.model';
import { describe, it, expect } from 'vitest';

describe('Calendar', () => {
  describe('constructor', () => {
    it('should initialize currentMonth to the first day of the provided month', () => {
      const customMonth = dayjs('2024-03-15');
      const calendar = new Calendar(customMonth);

      expect(calendar.currentMonth().isSame(dayjs('2024-03-01'), 'day')).toBe(
        true,
      );
    });

    it('should default currentMonth to the first day of the current month', () => {
      const calendar = new Calendar();
      const expectedMonth = dayjs().date(1);

      expect(calendar.currentMonth().isSame(expectedMonth, 'day')).toBe(true);
    });

    it('should initialize selectedDate to the provided date', () => {
      const customDate = dayjs('2024-03-15');
      const calendar = new Calendar(undefined, customDate);

      expect(calendar.selectedDate().isSame(customDate, 'day')).toBe(true);
    });

    it('should default selectedDate to today if none is provided', () => {
      const calendar = new Calendar();
      const today = dayjs();

      expect(calendar.selectedDate().isSame(today, 'day')).toBe(true);
    });
  });
  describe('set selected date', () => {
    it('Should set the selected date correctly', () => {
      const calendar = new Calendar();
      const date = dayjs('01-02-2024');
      calendar.selectDate(date);
      expect(calendar.selectedDate().isSame(date, 'day')).toBe(true);
    });
  });
  describe('nextMonth', () => {
    it('should move the currentMonth to the next month', () => {
      const customMonth = dayjs('2024-01-01');
      const calendar = new Calendar(customMonth);

      calendar.nextMonth();

      expect(calendar.currentMonth().isSame(dayjs('2024-02-01'), 'day')).toBe(
        true,
      );
    });
  });

  describe('previousMonth', () => {
    it('should move the currentMonth to the previous month', () => {
      const customMonth = dayjs('2024-02-01');
      const calendar = new Calendar(customMonth);

      calendar.previousMonth();

      expect(calendar.currentMonth().isSame(dayjs('2024-01-01'), 'day')).toBe(
        true,
      );
    });
  });

  describe('daysOfMonths', () => {
    it('should generate the correct number of days including days outside the current month', () => {
      const customMonth = dayjs('2024-02-01'); // February 2024 starts on a Thursday
      const calendar = new Calendar(customMonth);

      const days = calendar.daysOfMonths();

      // Five whole weeks: February 2024 fits in 35 cells
      expect(days.length).toBe(35);

      // Days before the month are included
      const daysBefore = days.filter(
        (day) => !day.inCurrentMonth && day.date.isBefore(customMonth, 'month'),
      );
      expect(daysBefore.length).toBe(4); // January 2024: Sunday to Wednesday

      // Days of the month are flagged as such
      const daysInMonth = days.filter((day) => day.inCurrentMonth);
      expect(daysInMonth.length).toBe(29); // February 2024 is a leap year

      // Days after the month are included
      const daysAfter = days.filter(
        (day) => !day.inCurrentMonth && day.date.isAfter(customMonth, 'month'),
      );
      expect(daysAfter.length).toBe(2); // Mars 2024
    });

    it('should mark today correctly in the days of the month', () => {
      const today = dayjs();
      const calendar = new Calendar();

      const days = calendar.daysOfMonths();
      const todayDay = days.find((day) => day.currentDate);

      expect(todayDay).toBeDefined();
      expect(todayDay!.date.isSame(today, 'day')).toBe(true);
    });

    it('should mark the selected date correctly in the days of the month', () => {
      const customMonth = dayjs('2024-02-01');
      const selectedDate = dayjs('2024-02-14');
      const calendar = new Calendar(customMonth, selectedDate);

      const days = calendar.daysOfMonths();
      const selectedDay = days.find((day) => day.selected);

      expect(selectedDay).toBeDefined();
      expect(selectedDay!.date.isSame(selectedDate, 'day')).toBe(true);
    });

    it('covers whole weeks, from Sunday to Saturday', () => {
      const days = new Calendar(dayjs('2025-03-01')).daysOfMonths();

      expect(days.length % 7).toBe(0);
    });

    it('spans six weeks when the month needs them', () => {
      // March 2025 starts on a Saturday and has 31 days: six rows.
      const days = new Calendar(dayjs('2025-03-01')).daysOfMonths();

      expect(days.length).toBe(42);
    });

    it('holds every day of the month it displays', () => {
      const days = new Calendar(dayjs('2025-03-01')).daysOfMonths();

      expect(days.filter((day) => day.inCurrentMonth).length).toBe(31);
    });

    it('starts the grid on a Sunday', () => {
      const days = new Calendar(dayjs('2025-03-01')).daysOfMonths();

      expect(days[0].date.day()).toBe(0);
    });

    it('marks exactly one day as selected', () => {
      const calendar = new Calendar(dayjs('2025-03-01'), dayjs('2025-03-14'));

      expect(calendar.daysOfMonths().filter((day) => day.selected).length).toBe(
        1,
      );
    });
  });

  describe('month navigation', () => {
    it('moves to January of the next year from December', () => {
      const calendar = new Calendar(dayjs('2025-12-01'));
      calendar.nextMonth();

      expect(calendar.currentMonth().format('YYYY-MM')).toBe('2026-01');
    });

    it('moves to December of the previous year from January', () => {
      const calendar = new Calendar(dayjs('2025-01-01'));
      calendar.previousMonth();

      expect(calendar.currentMonth().format('YYYY-MM')).toBe('2024-12');
    });

    it('regenerates the grid after navigating', () => {
      const calendar = new Calendar(dayjs('2025-01-01'));
      calendar.nextMonth();
      const days = calendar.daysOfMonths().filter((day) => day.inCurrentMonth);

      expect(days.length).toBe(28);
    });

    it('keeps a leap day in February 2024', () => {
      const days = new Calendar(dayjs('2024-02-01'))
        .daysOfMonths()
        .filter((day) => day.inCurrentMonth);

      expect(days.length).toBe(29);
    });
  });

  describe('invalid dates', () => {
    it('rejects an unparsable month instead of looping forever', () => {
      expect(() => new Calendar(dayjs('pas-une-date'))).toThrowError();
    });

    it('rejects an unparsable selected date', () => {
      expect(
        () => new Calendar(dayjs('2025-03-01'), dayjs('pas-une-date')),
      ).toThrowError();
    });

    it('rejects selecting an unparsable date', () => {
      const calendar = new Calendar(dayjs('2025-03-01'));

      expect(() => calendar.selectDate(dayjs('pas-une-date'))).toThrowError();
    });
  });
});
