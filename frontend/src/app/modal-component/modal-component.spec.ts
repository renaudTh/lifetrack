import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal-component';
import { testProviders } from '../../testing/test-providers';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: testProviders(),
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('closes when Escape is pressed', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(component.visible()).toBe(false);
  });

  it('ignores Escape while closed', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(component.visible()).toBe(false);
  });

  it('marks itself as a modal dialog', () => {
    const dialog = (fixture.nativeElement as HTMLElement).querySelector(
      '[role="dialog"]',
    );

    expect(dialog?.getAttribute('aria-modal')).toBe('true');
  });
});
