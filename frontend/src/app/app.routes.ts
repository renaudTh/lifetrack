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
    // Chargee a la demande : elle embarque chart.js, inutile a qui n'ouvre
    // jamais les statistiques.
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
