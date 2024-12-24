import { Activity, ActivityStats } from "@lifetrack/lib";
import { ChartData, ChartOptions } from "chart.js";


export function generateChartsData(activity: Activity, stats: ActivityStats, sample: string[]): [ChartData<'line'>, ChartOptions<'line'>] {

    
    const data: ChartData<'line'> = {
        labels: sample, // Noms des semaines
        datasets: [
          {
            label: `${activity.description} : ${activity.unit}`,
            data: stats.data,
            borderColor: 'rgba(75, 192, 192, 1)', // Couleur de la ligne
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Couleur sous la ligne
            fill: true,
            tension: 0, // Lissage de la courbe
          },
        ],
      };
      const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            title: {
              display: false,
              text: 'Semaines',
            },
            ticks: {
              display: false,
            }
          },
          y: {
            title: {
              display: false,
              text: activity.unit,
            },
            grid:{
              display: false,
            },
            beginAtZero: true,
          },
        },
      };
    return [data, options];
}