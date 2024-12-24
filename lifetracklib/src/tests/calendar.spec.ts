import dayjs from "dayjs";
import { Calendar } from "../calendar";


describe("Calendar", () => {
  let calendar: Calendar;

  beforeEach(() => {
    calendar = new Calendar();
  });

  describe("constructor", () => {
    it("should initialize the current month to the first day of the current month", () => {
      const currentMonth = dayjs().date(1);
      expect(calendar.currentMonth.isSame(currentMonth, "day")).toBe(true);
    });

    it("should initialize the selected date to today", () => {
      const today = dayjs();
      expect(calendar.selectedDate.isSame(today, "day")).toBe(true);
    });
  });

  describe("nextMonth", () => {
    it("should move the current month to the next month", () => {
      const initialMonth = calendar.currentMonth.clone();
      calendar.nextMonth();
      const expectedMonth = initialMonth.add(1, "month");
      expect(calendar.currentMonth.isSame(expectedMonth, "month")).toBe(true);
    });
  });

  describe("previousMonth", () => {
    it("should move the current month to the previous month", () => {
      const initialMonth = calendar.currentMonth.clone();
      calendar.previousMonth();
      const expectedMonth = initialMonth.subtract(1, "month");
      expect(calendar.currentMonth.isSame(expectedMonth, "month")).toBe(true);
    });
  });

  describe("selectedDate", () => {
    it("should allow setting and getting the selected date", () => {
      const newDate = dayjs().add(10, "days");
      calendar.selectedDate = newDate;
      expect(calendar.selectedDate.isSame(newDate, "day")).toBe(true);
    });
  });

  describe("daysOfMonths", () => {
    it("should generate the correct number of days for a month view", () => {
      const days = calendar.daysOfMonths;

      // Ensure the first day is a Sunday (calendar starts on Sunday)
      expect(days[0].date.day()).toBe(0);

      // Ensure the last day is a Saturday (calendar ends on Saturday)
      expect(days[days.length - 1].date.day()).toBe(6);
    });

    it("should correctly mark days in the current month", () => {
      const days = calendar.daysOfMonths;
      days.forEach((day) => {
        if (day.date.month() === calendar.currentMonth.month()) {
          expect(day.inCurrentMonth).toBe(true);
        } else {
          expect(day.inCurrentMonth).toBe(false);
        }
      });
    });

    it("should correctly mark today as the current date", () => {
      const today = dayjs();
      const days = calendar.daysOfMonths;

      const todayDay = days.find((day) => day.currentDate);
      if (todayDay) {
        expect(todayDay.date.isSame(today, "day")).toBe(true);
      } else {
        expect(todayDay).toBeUndefined();
      }
    });

    it("should correctly mark the selected date", () => {
      const selectedDate = dayjs().add(5, "days");
      calendar.selectedDate = selectedDate;

      const days = calendar.daysOfMonths;

      const selectedDay = days.find((day) => day.selected);
      if (selectedDay) {
        expect(selectedDay.date.isSame(selectedDate, "day")).toBe(true);
      }
    });
  
  });
});