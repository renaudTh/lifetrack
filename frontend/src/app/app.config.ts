import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { API_PROVIDER } from '../domain/api.provider.interface';
import { StateService } from '../domain/state.service';
import { environment } from '../environments/environment';
import { API_URL } from '../environments/environment.interface';
import { ApiProvider } from '../providers/api.provider.service';
import { apiInterceptorFn } from '../utils/api.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: API_URL,
      useValue: environment.apiUrl,
    },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.auth0.audience,
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: `${environment.apiUrl}/*`,
            tokenOptions: {
              authorizationParams: {
                audience: environment.auth0.audience,
              }
            }
          }
        ]
      }
    }),
    provideHttpClient(withInterceptors([apiInterceptorFn, authHttpInterceptorFn])),
    {
      provide: API_PROVIDER,
      useClass: ApiProvider
    },
    StateService, provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }), provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ]
};
