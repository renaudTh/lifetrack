import dayjs from 'dayjs';
import { Day, DjsDate } from './models/date.model';

const SUNDAY = 0;

function assertValid(date: DjsDate, what: string): DjsDate {
  // `dayjs('n importe quoi').day()` vaut NaN, et NaN !== SUNDAY est toujours
  // vrai : une date invalide ferait tourner les boucles de grille sans fin.
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

  /** La grille couvre des semaines entieres : 28 a 42 jours selon le mois. */
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
