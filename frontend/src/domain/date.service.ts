import { computed, Injectable, signal, Signal, WritableSignal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";


import { Calendar, Day, DjsDate } from '@lifetrack/lib';
import { Observable } from "rxjs";


@Injectable({ providedIn: "root" })
export class DateService {

    private _selectedDate: WritableSignal<DjsDate>;
    private _currentMonth: WritableSignal<DjsDate>;

    //Rxjs compatibility but uses effects under the hood
    public readonly currentMonth$: Observable<DjsDate>;
    public readonly selectedDate$: Observable<DjsDate>;

    private calendar: Calendar;
    constructor() {
        this.calendar = new Calendar()
        this._currentMonth = signal<DjsDate>(this.calendar.currentMonth);
        this._selectedDate = signal<DjsDate>(this.calendar.selectedDate);
        this.currentMonth$ = toObservable(this._currentMonth);
        this.selectedDate$ = toObservable(this._selectedDate);
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
    public readonly selectedDateString: Signal<string> = computed(() =>this._selectedDate().format('dddd, MMMM D'))
    public readonly daysOfCurrentMonth :Signal<Day[]> = computed(() => {
        this._currentMonth();
        this._selectedDate();
        return this.calendar.daysOfMonths
    })

    set selectedDate(date: DjsDate) {
        this.calendar.selectedDate = date;
        this._selectedDate.set(this.calendar.selectedDate);
    }
}