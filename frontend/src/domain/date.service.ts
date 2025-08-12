import { computed, Injectable, signal, Signal, WritableSignal } from "@angular/core";


import { Calendar, Day, DjsDate } from '@lifetrack/lib';


@Injectable({ providedIn: "root" })
export class DateService {

    private _selectedDate: WritableSignal<DjsDate>;
    private _currentMonth: WritableSignal<DjsDate>;

    public readonly currentMonthSignal: Signal<DjsDate>;
    public readonly selectedDateSignal: Signal<DjsDate>;

    private calendar: Calendar;
    constructor() {
        this.calendar = new Calendar()
        this._currentMonth = signal<DjsDate>(this.calendar.currentMonth);
        this._selectedDate = signal<DjsDate>(this.calendar.selectedDate);
        this.currentMonthSignal = computed(() => this._currentMonth());
        this.selectedDateSignal = computed(() => this._selectedDate());
    }
    public nextMonth() {
        this.calendar.nextMonth();
        this._currentMonth.set(this.calendar.currentMonth);
    }
    public previousMonth() {
        this.calendar.previousMonth();
        this._currentMonth.set(this.calendar.currentMonth);
    }
    public readonly currentMonthString: Signal<string> = computed(() => this._currentMonth().format("MMMM YYYY"));
    public readonly selectedDateString: Signal<string> = computed(() => this._selectedDate().format('dddd, MMMM D'))
    public readonly daysOfCurrentMonth: Signal<Day[]> = computed(() => {
        this._currentMonth();
        this._selectedDate();
        return this.calendar.daysOfMonths
    })

    set selectedDate(date: DjsDate) {
        this.calendar.selectedDate = date;
        this._selectedDate.set(this.calendar.selectedDate);
    }
}