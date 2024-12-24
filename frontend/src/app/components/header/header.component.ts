import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { UserService } from '../../../domain/user.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
@Component({
    selector: 'app-header',
    imports: [Menubar, AsyncPipe],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private userService = inject(UserService);
  private readonly router = inject(Router);

  protected user$ = this.userService.user$;

  public items: MenuItem[] = [
    {
      icon: "pi pi-home",
      label: "Home",
      command: () => this.router.navigate([""])
    },
    {
      icon: "pi pi-chart-line",
      label: "Statistics",
      command: () => this.router.navigate(["statistics"])
    },
    {
      icon: 'pi pi-user',
      label: "Profile"
    },
    {
      icon: "pi pi-sign-out",
      label: "Logout",
      command: async () => {
        await this.userService.logout();
        
      }
    },
  ] 
}
