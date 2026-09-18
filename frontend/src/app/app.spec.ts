import { TestBed } from '@angular/core/testing';
import dayjs from 'dayjs';
import { API_PROVIDER } from '../domain/api.provider.interface';
import { StateService } from '../domain/state.service';
import { apiStub, testProviders } from '../testing/test-providers';
import { App } from './app';

describe('App', () => {
  const render = () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const banner = () => render().querySelector('.notification.is-danger');

  it('should create the app', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: testProviders(),
    }).compileComponents();

    expect(TestBed.createComponent(App).componentInstance).toBeTruthy();
  });

  it('shows no error banner while nothing has failed', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: testProviders(),
    }).compileComponents();

    expect(banner()).toBeNull();
  });

  it('shows an error banner once a request has failed', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        ...testProviders(),
        {
          provide: API_PROVIDER,
          useValue: {
            ...apiStub,
            getHistory: () => Promise.reject(new Error('offline')),
          },
        },
      ],
    }).compileComponents();

    TestBed.inject(StateService).loadHistory(dayjs(), dayjs());
    // The .then().catch() chain must settle before we inspect the DOM.
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(banner()).not.toBeNull();
  });
});
