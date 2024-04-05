import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, combineLatest, map, zip } from "rxjs";
import { Day } from "./date";

@Injectable({ providedIn: "root" })
export class DateService {

    private _selectedDate: BehaviorSubject<Date>;
    private _displayedDate: BehaviorSubject<Date>;

    public selectedDate$: Observable<Date>;
    public displayedDate$: Observable<Date>;

    constructor() {

        const date = new Date();
        date.setDate(1);
        this._displayedDate = new BehaviorSubject<Date>(date);
        this._selectedDate = new BehaviorSubject<Date>(new Date());
        this.selectedDate$ = this._selectedDate.asObservable();
        this.displayedDate$ = this._displayedDate.asObservable();

    }

    public nextMonth() {
        const date = this._displayedDate.value;
        date.setMonth(date.getMonth() + 1);
        this._displayedDate.next(date);
    }
    public previousMonth() {
        const date = this._displayedDate.value;
        date.setMonth(date.getMonth() - 1);
        this._displayedDate.next(date);
    }
    get displayedDateString$(): Observable<string> {
        return this.displayedDate$.pipe(
            map((date) => date.toLocaleDateString('en-US', { month: 'long', year: "numeric"}))
        )
    }

    get selectedDateString$(): Observable<string>{
        return this.selectedDate$.pipe(map((date) => date.toLocaleDateString("en-US", {weekday: "long", month: "long", day: "2-digit"})))
    }

    get daysOfCurrentMonth$(): Observable<Day[]> {
        
        return combineLatest([this.displayedDate$, this.selectedDate$]).pipe(
            map(([displayed, selected]) => this._generateDaysOfMonth(displayed, selected)
        ))
    }
    set selectedDate(date: Date) {
        this._selectedDate.next(date);
    }

    private _isToday(date: Date): boolean {
        return date.toDateString() === new Date().toDateString();
    }
    private _equals(date1: Date, date2: Date): boolean{
        return date1.toDateString() === date2.toDateString();
    }
    private _generateDaysOfMonth(date: Date, selected: Date): Day[] {

        const result: Day[] = [];
        let _date = new Date(date);

        // We want to begin on Monday
        while (_date.getDay() !== 1) {
            const dayNumber = _date.getDate();
            _date.setDate(dayNumber - 1);
            const isSelected = this._equals(_date, selected);
            const day: Day = { date: new Date(_date), inCurrentMonth: false, currentDate: this._isToday(_date), selected:isSelected}
            result.unshift(day);
        }
        // Reset to the beginning of the month
        _date = new Date(date);
        while (_date.getMonth() === date.getMonth()) {
            const dayNumber = _date.getDate();
            const isSelected = this._equals(_date, selected);
            result.push({ date: new Date(_date), inCurrentMonth: true, currentDate: this._isToday(_date),  selected: isSelected });
            _date.setDate(dayNumber + 1);
        }
        //We want to end on sunday
        while (_date.getDay() !== 1) {
            const dayNumber = _date.getDate();
            const isSelected = this._equals(_date, selected);
            const day: Day = { date: new Date(_date), inCurrentMonth: false, currentDate: this._isToday(_date), selected:isSelected}
            result.push(day);
            _date.setDate(dayNumber + 1);
        }
        return result;
    }


}