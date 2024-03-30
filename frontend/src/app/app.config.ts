import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ACTIVITY_PROVIDER } from '../domain/activity.provider.interface';
import { ActivityProviderService } from '../providers/activity.provider.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: ACTIVITY_PROVIDER,
      useClass: ActivityProviderService
    }
  ]
};
