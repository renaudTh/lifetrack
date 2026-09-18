import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  viewChild,
  ElementRef,
} from '@angular/core';
import { ActivityStats } from '@lifetrack/lib';
import { Chart, ChartDataset, registerables } from 'chart.js';

Chart.register(...registerables);

const LINE_COLORS = [
  '#3273dc',
  '#48c774',
  '#ffdd57',
  '#f14668',
  '#9d65c9',
] as const;

@Component({
  selector: 'app-stats-chart',
  template: '<canvas #canvas></canvas>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsChart {
  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart | undefined;

  public readonly buckets = input.required<string[]>();
  public readonly stats = input.required<ActivityStats[]>();

  constructor() {
    // Unavoidable: chart.js is imperative and has to be pushed the data on every
    // signal change. This is the only effect in the project.
    effect(() => this.draw(this.buckets(), this.stats()));
    inject(DestroyRef).onDestroy(() => this.chart?.destroy());
  }

  private draw(buckets: string[], stats: ActivityStats[]): void {
    // ponytail: a single axis for heterogeneous units (min, cl, u).
    // Move to one axis per unit if this becomes misleading.
    const datasets = stats.map(
      (stat, index): ChartDataset<'line', number[]> => ({
        label: `${stat.activity.representation} ${stat.activity.description}`,
        data: stat.series,
        borderColor: LINE_COLORS[index % LINE_COLORS.length],
        backgroundColor: LINE_COLORS[index % LINE_COLORS.length],
        tension: 0.3,
      }),
    );

    if (this.chart === undefined) {
      this.chart = new Chart(this.canvas().nativeElement, {
        type: 'line',
        data: { labels: buckets, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
        },
      });
      return;
    }

    this.chart.data.labels = buckets;
    this.chart.data.datasets = datasets;
    this.chart.update();
  }
}
