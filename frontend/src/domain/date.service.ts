import { Injectable } from "@angular/core";
import dayjs from "dayjs";
import { BehaviorSubject, Observable, combineLatest, map } from "rxjs";
import { Day, DjsDate } from "./date";

@Injectable({ providedIn: "root" })
export class DateService {

    private _selectedDate: BehaviorSubject<DjsDate>;
    private _currentMonth: BehaviorSubject<DjsDate>;

    public selectedDate$: Observable<DjsDate>;
    public currentMonth$: Observable<DjsDate>;

    constructor() {

        const date = dayjs().date(1)
        this._currentMonth = new BehaviorSubject<DjsDate>(date);
        this._selectedDate = new BehaviorSubject<DjsDate>(dayjs());
        this.selectedDate$ = this._selectedDate.asObservable();
        this.currentMonth$ = this._currentMonth.asObservable();
    }

    public nextMonth() {
        const date = this._currentMonth.value.add(1, 'month');
        this._currentMonth.next(date);
    }
    public previousMonth() {
        const date = this._currentMonth.value.subtract(1, 'month');
        this._currentMonth.next(date);
    }
    get displayedDateString$(): Observable<string> {
        return this.currentMonth$.pipe(
            map((date) => date.format("MMMM YYYY")
        ))
    }

    get selectedDateString$(): Observable<string>{
        return this.selectedDate$.pipe(map((date) => date.format('dddd, MMMM D')))
    }

    get daysOfCurrentMonth$(): Observable<Day[]> {
        return combineLatest([this.currentMonth$, this.selectedDate$]).pipe(
            map(([displayed, selected]) => this.generate(displayed, selected)
        ))
    }
    set selectedDate(date: DjsDate) {
        this._selectedDate.next(date);
    }

    public generate(currentMonth: DjsDate, selectedDate: DjsDate): Day[]{
        const result: Day[] = [];
        let runner = currentMonth.clone();
        while(runner.day() !== 0){
            runner = runner.subtract(1, "day");
            const selected = runner.isSame(selectedDate, 'day')
            const currentDate = runner.isSame(dayjs(), "day")
            const day: Day = { date: runner, inCurrentMonth: false, currentDate, selected} 
            result.unshift(day);
        }
        runner = currentMonth.clone();
        while(runner.month() === currentMonth.month()){
            const selected = runner.isSame(selectedDate, 'day')
            const currentDate = runner.isSame(dayjs(), "day")
            result.push({ date: runner, inCurrentMonth: true, currentDate,  selected });
            runner = runner.add(1, "day");
        }
        
        while(runner.day() !== 0){
            const selected = runner.isSame(selectedDate, 'day')
            const currentDate = runner.isSame(dayjs(), "day")
            result.push({ date: runner, inCurrentMonth: false, currentDate,  selected });
            runner = runner.add(1, "day");
        }
        return result
    }
}