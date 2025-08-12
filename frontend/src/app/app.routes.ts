import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { Home } from './home/home';

export const routes: Routes = [
    {
        path: "",
        component: Home,
        canActivate: [AuthGuard],
    }
];
