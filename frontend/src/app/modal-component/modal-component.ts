import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  model,
} from '@angular/core';

@Component({
  selector: 'app-modal-component',
  imports: [],
  templateUrl: './modal-component.html',
  styleUrl: './modal-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  private host = inject(ElementRef<HTMLElement>);

  public visible = model<boolean>(false);

  protected modalClasses = computed(() => {
    const opened = this.visible();
    if (opened) return ['modal', 'is-active'];
    return ['modal'];
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible()) this.close();
  }

  /** Piege le focus : sans lui, la tabulation part derriere la modale. */
  @HostListener('document:keydown.tab', ['$event'])
  onTab(event: Event): void {
    if (!this.visible() || !(event instanceof KeyboardEvent)) return;
    const focusable = this.focusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  close() {
    this.visible.set(false);
  }

  private focusableElements(): HTMLElement[] {
    const root: unknown = this.host.nativeElement;
    if (!(root instanceof HTMLElement)) return [];
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select, textarea, a[href]',
      ),
    ).filter((element) => element.offsetParent !== null);
  }
}
