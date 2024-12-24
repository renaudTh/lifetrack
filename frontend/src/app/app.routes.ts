import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard, LoginGuard } from './guards/auth.guard';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { activitiesResolver } from './resolvers/activities.resolver';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "statistics",
        component: StatisticsComponent,
        canActivate: [AuthGuard],
        resolve:{
            activities: activitiesResolver,
        }
    },
    {
        path: "login",
        component: LoginComponent,
        canActivate: [
           LoginGuard
        ]
    }
];
