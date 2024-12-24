import dayjs from "dayjs";

export interface Day {
    date: DjsDate;
    inCurrentMonth: boolean;
    currentDate?: boolean;
    selected: boolean;
}

export type DateSampling = "day" | "week" | "month" | "year";


export type DjsDate = dayjs.Dayjs;