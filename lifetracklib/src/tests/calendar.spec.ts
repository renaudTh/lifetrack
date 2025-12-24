import dayjs from 'dayjs';
import { Calendar } from '../calendar';
import { Day } from '../models/date.model';
import { describe, it, expect } from 'vitest';

describe('Calendar', () => {
  describe('constructor', () => {
    it('should initialize currentMonth to the first day of the provided month', () => {
      const customMonth = dayjs('2024-03-15');
      const calendar = new Calendar(customMonth);

      expect(calendar.currentMonth.isSame(dayjs('2024-03-01'), 'day')).toBe(
        true,
      );
    });

    it('should default currentMonth to the first day of the current month', () => {
      const calendar = new Calendar();
      const expectedMonth = dayjs().date(1);

      expect(calendar.currentMonth.isSame(expectedMonth, 'day')).toBe(true);
    });

    it('should initialize selectedDate to the provided date', () => {
      const customDate = dayjs('2024-03-15');
      const calendar = new Calendar(undefined, customDate);

      expect(calendar.selectedDate.isSame(customDate, 'day')).toBe(true);
    });

    it('should default selectedDate to today if none is provided', () => {
      const calendar = new Calendar();
      const today = dayjs();

      expect(calendar.selectedDate.isSame(today, 'day')).toBe(true);
    });
  });
  describe('set selected date', () => {
    it('Should set the selected date correctly', () => {
      const calendar = new Calendar();
      const date = dayjs('01-02-2024');
      calendar.selectedDate = date;
      expect(calendar.selectedDate.isSame(date, 'day')).toBe(true);
    });
  });
  describe('nextMonth', () => {
    it('should move the currentMonth to the next month', () => {
      const customMonth = dayjs('2024-01-01');
      const calendar = new Calendar(customMonth);

      calendar.nextMonth();

      expect(calendar.currentMonth.isSame(dayjs('2024-02-01'), 'day')).toBe(
        true,
      );
    });
  });

  describe('previousMonth', () => {
    it('should move the currentMonth to the previous month', () => {
      const customMonth = dayjs('2024-02-01');
      const calendar = new Calendar(customMonth);

      calendar.previousMonth();

      expect(calendar.currentMonth.isSame(dayjs('2024-01-01'), 'day')).toBe(
        true,
      );
    });
  });

  describe('daysOfMonths', () => {
    it('should generate the correct number of days including days outside the current month', () => {
      const customMonth = dayjs('2024-02-01'); // Février 2024 commence un jeudi
      const calendar = new Calendar(customMonth);

      const days = calendar.daysOfMonths;

      // Vérifier le nombre total de jours (42 : 6 semaines complètes pour une vue de calendrier standard)
      expect(days.length).toBe(35);

      // Vérifier que les jours avant le mois sont inclus
      const daysBefore = days.filter(
        (day) => !day.inCurrentMonth && day.date.isBefore(customMonth, 'month'),
      );
      expect(daysBefore.length).toBe(4); // Janvier 2024 : Dimanche à Mercredi avant Février

      // Vérifier que les jours du mois sont correctement marqués
      const daysInMonth = days.filter((day) => day.inCurrentMonth);
      expect(daysInMonth.length).toBe(29); // Février 2024 (année bissextile)

      // Vérifier que les jours après le mois sont inclus
      const daysAfter = days.filter(
        (day) => !day.inCurrentMonth && day.date.isAfter(customMonth, 'month'),
      );
      expect(daysAfter.length).toBe(2); // Mars 2024
    });

    it('should mark today correctly in the days of the month', () => {
      const today = dayjs();
      const calendar = new Calendar();

      const days = calendar.daysOfMonths;
      const todayDay = days.find((day) => day.currentDate);

      expect(todayDay).toBeDefined();
      expect(todayDay!.date.isSame(today, 'day')).toBe(true);
    });

    it('should mark the selected date correctly in the days of the month', () => {
      const customMonth = dayjs('2024-02-01');
      const selectedDate = dayjs('2024-02-14');
      const calendar = new Calendar(customMonth, selectedDate);

      const days = calendar.daysOfMonths;
      const selectedDay = days.find((day) => day.selected);

      expect(selectedDay).toBeDefined();
      expect(selectedDay!.date.isSame(selectedDate, 'day')).toBe(true);
    });
  });
});
