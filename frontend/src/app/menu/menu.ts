import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-menu',
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  private readonly authService = inject(AuthService);
  public user$ = this.authService.user$;

  logout() {
    this.authService.logout({
      logoutParams: { returnTo: document.location.origin },
    });
  }
}
