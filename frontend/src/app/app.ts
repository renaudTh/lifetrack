import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './menu/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Lifetrack');

  private isActive = signal<boolean>(false);

  protected classList = computed(() => {
    return this.isActive() ? ['is-active'] : [''];
  });
  displayMenu() {
    this.isActive.set(!this.isActive());
  }
}
