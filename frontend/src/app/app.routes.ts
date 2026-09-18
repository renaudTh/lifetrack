import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { Home } from './home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Lifetrack',
    canActivate: [AuthGuard],
  },
  {
    // Loaded on demand: it carries chart.js, useless to anyone who never opens
    // the statistics.
    path: 'stats',
    loadComponent: () =>
      import('./statistics-page/statistics-page').then((m) => m.StatisticsPage),
    title: 'Statistics · Lifetrack',
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
