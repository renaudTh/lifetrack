import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { StatsEngine } from "../stats.engine";
import { ActivityRecord } from "../models/activity.model";
import { testActivities } from "./data";


dayjs.extend(weekOfYear);

describe("StatsEngine", () => {
  const start = dayjs("2024-01-01");
  const end = dayjs("2024-01-10");
  const sampling = "day";

  let statsEngine: StatsEngine;

  beforeEach(() => {
    statsEngine = new StatsEngine(start, end, sampling);
  });

  describe("generateSampleKeys", () => {
    it("should generate daily sample keys", () => {
      const engine = new StatsEngine(start, end, "day");
      const keys = engine.generateSampleKeys();
      expect(keys).toEqual([
        "2024-01-02",
        "2024-01-03",
        "2024-01-04",
        "2024-01-05",
        "2024-01-06",
        "2024-01-07",
        "2024-01-08",
        "2024-01-09",
        "2024-01-10",
      ]);
    });

    it("should generate weekly sample keys", () => {
      const engine = new StatsEngine(start, dayjs("2024-02-01"), "week");
      const keys = engine.generateSampleKeys();
      expect(keys).toEqual(["2024-2", "2024-3", "2024-4", "2024-5"]);
    });

    it("should generate monthly sample keys", () => {
      const engine = new StatsEngine(start, dayjs("2024-05-01"), "month");
      const keys = engine.generateSampleKeys();
      expect(keys).toEqual(["2024-02", "2024-03", "2024-04", "2024-05"]);
    });

    it("should generate yearly sample keys", () => {
      const engine = new StatsEngine(start, dayjs("2026-01-01"), "year");
      const keys = engine.generateSampleKeys();
      expect(keys).toEqual(["2025", "2026"]);
    });
  });

  describe("compute", () => {
    it("should compute aggregated data for daily sampling", () => {
      const records: ActivityRecord[] = [
        {
          id: "",
          activity: testActivities[0],
          number: 1,
          date: dayjs("2024-01-02"),
        },
        {
          id: "",
          activity: testActivities[1],
          number: 2,
          date: dayjs("2024-01-02"),
        },
        {
          id: "",
          activity: testActivities[1],
          number: 1,
          date: dayjs("2024-01-03"),
        },
        {
          id: "",
          activity: testActivities[2],
          number: 3,
          date: dayjs("2024-01-02"),
        },
      ];

      const stats = statsEngine.compute(records);

      expect(stats).toEqual([
        {
          activityId: "0",
          data: [30, 0, 0, 0, 0, 0, 0, 0, 0], // 1x30 for "Play the piano"
        },
        {
          activityId: "1",
          data: [10, 5, 0, 0, 0, 0, 0, 0, 0], // 2x5 + 1x5 for "Bike ride"
        },
        {
          activityId: "2",
          data: [75, 0, 0, 0, 0, 0, 0, 0, 0], // 3x25 for "Drink beer"
        },
      ]);
    });

    it("should compute aggregated data for weekly sampling", () => {
      const records: ActivityRecord[] = [
        {
          id: "",
          activity: testActivities[0],
          number: 1,
          date: dayjs("2024-01-08"),
        },
        {
          id: "",
          activity: testActivities[1],
          number: 5,
          date: dayjs("2024-01-18"),
        },
        {
          id: "",
          activity: testActivities[1],
          number: 1,
          date: dayjs("2024-01-09"),
        },
        {
          id: "",
          activity: testActivities[2],
          number: 2,
          date: dayjs("2024-01-25"),
        },
      ];

      const engine = new StatsEngine(dayjs("2024-01-01"), dayjs("2024-01-30"), "week");
      const stats = engine.compute(records);
      expect(stats).toEqual([
        {
          activityId: "0",
          data: [30,0, 0,0], // 1x30 for "Play the piano"
        },
        {
          activityId: "1",
          data: [5,25,0, 0], // 1x5 for "Bike ride"
        },
        {
          activityId: "2",
          data: [0, 0, 50,0], // 2x25 for "Drink beer"
        },
      ]);
    });
  });
});
