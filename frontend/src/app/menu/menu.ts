import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-menu',
  imports: [AsyncPipe],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {


  private readonly authService = inject(AuthService)
  public user$ = this.authService.user$;

  logout() {
    this.authService.logout({
      logoutParams: { "returnTo": document.location.origin }
    })
  }
} 
