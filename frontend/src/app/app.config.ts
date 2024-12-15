import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { ACTIVITY_PROVIDER } from '../domain/activity.provider.interface';
import { routes } from './app.routes';

import { RECORD_PROVIDER } from '../domain/record.provider.interface';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import Lara from '@primeng/themes/lara';
import { providePrimeNG } from 'primeng/config';
import { ActivityProviderService } from '../providers/activity.provider.service';
import { CLIENT_ID, DB_ID } from '../providers/api.config';
import { RecordProviderService } from '../providers/record.provider.service';
import { ActivitiesEffects } from './stores/activities-store/activities.effects';
import { activitiesReducer } from './stores/activities-store/activities.reducer';
import { RecordsEffects } from './stores/record-store/record.effects';
import { recordsReducer } from './stores/record-store/record.reducer';


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
        useClass: RecordProviderService,
    },
    {
       provide: CLIENT_ID,
       useValue: '675daf91000a5b007d0c' 
    },
    {
        provide: DB_ID,
        useValue: "675db0a800230f2466fe"
     },
    provideStore(),
    provideState({ name: 'records', reducer: recordsReducer}),
    provideState({ name: 'activities', reducer: activitiesReducer}),
    provideEffects(RecordsEffects, ActivitiesEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
