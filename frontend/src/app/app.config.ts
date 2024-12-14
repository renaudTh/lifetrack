import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ACTIVITY_PROVIDER } from '../domain/activity.provider.interface';
import { ActivityProviderService } from '../providers/activity.provider.service';
import { RECORD_PROVIDER } from '../domain/record.provider.interface';
import { ActivityRecordProvider } from '../providers/record.provider.service';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { recordsReducer } from './stores/record-store/record.reducer';
import { RecordsEffects } from './stores/record-store/record.effects';
import { activitiesReducer } from './stores/activities-store/activities.reducer';
import { ActivitiesEffects } from './stores/activities-store/activities.effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({ 
        theme: {
            preset: Lara
        }
    }),
    provideRouter(routes),
    {
        provide: ACTIVITY_PROVIDER,
        useClass: ActivityProviderService
    },
    {
        provide: RECORD_PROVIDER,
        useClass: ActivityRecordProvider,
    },
    provideStore(),
    provideState({ name: 'records', reducer: recordsReducer}),
    provideState({ name: 'activities', reducer: activitiesReducer}),
    provideEffects(RecordsEffects, ActivitiesEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
