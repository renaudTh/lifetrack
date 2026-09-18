import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DjsDate, HistoryStats } from '@lifetrack/lib';
import dayjs from 'dayjs';
import { StateService, StatsSlice } from '../../domain/state.service';
import { StatisticsPage } from './statistics-page';

describe('StatisticsPage', () => {
  let fixture: ComponentFixture<StatisticsPage>;
  let slice: ReturnType<typeof signal<StatsSlice>>;
  let requestedRanges: { start: DjsDate; end: DjsDate }[];

  const emptyHistory: HistoryStats = {
    start: dayjs('2025-01-01'),
    end: dayjs('2025-12-31'),
    sampling: 'month',
    buckets: ['2025-01'],
    stats: [],
  };

  const render = () => {
    fixture = TestBed.createComponent(StatisticsPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(async () => {
    slice = signal<StatsSlice>({ status: 'loading' });
    requestedRanges = [];

    await TestBed.configureTestingModule({
      imports: [StatisticsPage],
      providers: [
        // The rest of the frontend suite fails with NG0908 without this provider:
        // the app went zoneless without the test configuration following.
        provideZonelessChangeDetection(),
        {
          provide: StateService,
          useValue: {
            selectStats: slice.asReadonly(),
            loadStats: (start: DjsDate, end: DjsDate) =>
              requestedRanges.push({ start, end }),
          },
        },
      ],
    }).compileComponents();
  });

  it('shows a progress bar while statistics are loading', () => {
    expect(render().querySelector('progress')).not.toBeNull();
  });

  it('shows an error notification when statistics cannot be loaded', () => {
    slice.set({ status: 'error', message: 'Server answered 500' });

    expect(render().querySelector('.notification.is-danger')).not.toBeNull();
  });

  it('shows an empty state when the period holds no record', () => {
    slice.set({ status: 'ready', history: emptyHistory });

    expect(render().querySelector('table')).toBeNull();
  });

  it('displays the average per period of an activity', () => {
    slice.set({
      status: 'ready',
      history: {
        ...emptyHistory,
        stats: [
          {
            activity: {
              id: '0',
              amount: 30,
              description: 'Piano',
              representation: 'P',
              unit: 'min',
            },
            cumsum: 3,
            total: 90,
            average: 45,
            last: dayjs('2025-06-01'),
            series: [90],
          },
        ],
      },
    });

    const cells = render().querySelectorAll('tbody td');

    expect(cells[2].textContent?.trim()).toBe('45');
  });

  it('requests statistics for the selected period on load', () => {
    render();

    expect(requestedRanges.length).toBe(1);
  });
});
