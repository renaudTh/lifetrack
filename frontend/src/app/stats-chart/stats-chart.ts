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
    // Force majeure : chart.js est imperatif, il faut lui repousser les donnees
    // a chaque changement de signal. C'est le seul effect du projet.
    effect(() => this.draw(this.buckets(), this.stats()));
    inject(DestroyRef).onDestroy(() => this.chart?.destroy());
  }

  private draw(buckets: string[], stats: ActivityStats[]): void {
    // ponytail: un axe unique pour des unites heterogenes (min, cl, u).
    // Passer a un axe par unite si la lecture devient trompeuse.
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
