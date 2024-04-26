import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: "",
        canActivate: [authGuard],
        component: HomeComponent
    },
    {
        path: "login",
        component: LoginComponent
    }
];
