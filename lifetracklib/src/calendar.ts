import dayjs from "dayjs";
import { Day, DjsDate } from "./models/date.model";

export class Calendar {

    private _selectedDate:DjsDate;
    private _currentMonth: DjsDate;

    constructor(currenMonth?: DjsDate, selectedDate?: DjsDate) {
        this._currentMonth = currenMonth?.date(1) ?? dayjs().date(1);
        this._selectedDate = selectedDate ?? dayjs();
    }

    public nextMonth() {
        this._currentMonth = this._currentMonth.add(1, 'month');
    }
    public previousMonth() {
        this._currentMonth = this._currentMonth.subtract(1, 'month');
    }

    get currentMonth(): DjsDate {
        return this._currentMonth;
    }

    get selectedDate(): DjsDate {
        return this._selectedDate
    }
    set selectedDate(date: DjsDate) {
        this._selectedDate = date;
    }

    get daysOfMonths(): Day[]{
        const result: Day[] = [];
        let runner = this.currentMonth.clone();
        while(runner.day() !== 0){
            runner = runner.subtract(1, "day");
            const selected = runner.isSame(this.selectedDate, 'day')
            const currentDate = runner.isSame(dayjs(), "day")
            const day: Day = { date: runner, inCurrentMonth: false, currentDate, selected} 
            result.unshift(day);
        }
        runner = this.currentMonth.clone();
        while(runner.month() === this.currentMonth.month()){
            const selected = runner.isSame(this.selectedDate, 'day')
            const currentDate = runner.isSame(dayjs(), "day")
            result.push({ date: runner, inCurrentMonth: true, currentDate,  selected });
            runner = runner.add(1, "day");
        }
        
        while(runner.day() !== 0){
            const selected = runner.isSame(this.selectedDate, 'day')
            const currentDate = runner.isSame(dayjs(), "day")
            result.push({ date: runner, inCurrentMonth: false, currentDate,  selected });
            runner = runner.add(1, "day");
        }
        return result
    }
}