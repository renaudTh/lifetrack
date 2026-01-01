import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { Home } from './home/home';
import { PickerService } from './picker.service';
import { StatisticsPage } from './statistics-page/statistics-page';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [AuthGuard],
    providers: [PickerService],
  },
  {
    path: 'stats',
    component: StatisticsPage,
    canActivate: [AuthGuard],
    providers: [],
  },
];
