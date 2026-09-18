import dayjs from 'dayjs';
import { Day, DjsDate } from './models/date.model';

const SUNDAY = 0;

function assertValid(date: DjsDate, what: string): DjsDate {
  // `dayjs('nonsense').day()` is NaN, and NaN !== SUNDAY is always true: an
  // invalid date would spin the grid loops forever.
  if (!date.isValid()) {
    throw new Error(`${what} is not a valid date`);
  }
  return date;
}

export class Calendar {
  private selected: DjsDate;
  private month: DjsDate;

  constructor(currentMonth?: DjsDate, selectedDate?: DjsDate) {
    this.month = assertValid(currentMonth ?? dayjs(), 'currentMonth').date(1);
    this.selected = assertValid(selectedDate ?? dayjs(), 'selectedDate');
  }

  public nextMonth(): void {
    this.month = this.month.add(1, 'month');
  }

  public previousMonth(): void {
    this.month = this.month.subtract(1, 'month');
  }

  public currentMonth(): DjsDate {
    return this.month;
  }

  public selectedDate(): DjsDate {
    return this.selected;
  }

  public selectDate(date: DjsDate): void {
    this.selected = assertValid(date, 'selectedDate');
  }

  /** The grid spans whole weeks: 28 to 42 days depending on the month. */
  public daysOfMonths(): Day[] {
    const today = dayjs();
    const toDay = (date: DjsDate, inCurrentMonth: boolean): Day => ({
      date,
      inCurrentMonth,
      currentDate: date.isSame(today, 'day'),
      selected: date.isSame(this.selected, 'day'),
    });

    const before: Day[] = [];
    let runner = this.month;
    while (runner.day() !== SUNDAY) {
      runner = runner.subtract(1, 'day');
      before.unshift(toDay(runner, false));
    }

    const current: Day[] = [];
    runner = this.month;
    while (runner.month() === this.month.month()) {
      current.push(toDay(runner, true));
      runner = runner.add(1, 'day');
    }

    const after: Day[] = [];
    while (runner.day() !== SUNDAY) {
      after.push(toDay(runner, false));
      runner = runner.add(1, 'day');
    }

    return [...before, ...current, ...after];
  }
}
