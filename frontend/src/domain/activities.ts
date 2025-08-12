import { ActivityRecord } from "@lifetrack/lib"
import dayjs from 'dayjs'
export const activities: any[] = [
    {
        id: "1",
        representation: "🥩",
        description: "Vegetarian exception",
        amount: 1,
        unit: "u"
    },
    {
        id: "2",
        representation: "🍺",
        description: "Drink beer",
        amount: 25,
        unit: "cl"
    },
    {
        id: "3",
        representation: "🍷",
        description: "Drink whine",
        amount: 1,
        unit: "glass"
    },
    {
        id: "4",
        representation: "🍹",
        description: "Drink cocktail",
        amount: 1,
        unit: "glass"
    },
    {
        id: "5",
        representation: "🚋",
        description: "Tram to work",
        amount: 1,
        unit: "trip"
    },
    {
        id: "6",
        representation: "🚴",
        description: "Bike to work",
        amount: 4,
        unit: "km"
    }
]

export const records: ActivityRecord[] = [
    {
        id: "0",
        activity: activities[1],
        date: dayjs(),
        number: 2,
    },
    {
        id: "1",
        activity: activities[5],
        date: dayjs(),
        number: 2,
    }
]