import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { ACTIVITY_PROVIDER } from '../domain/activity.provider.interface';
import { routes } from './app.routes';

import { RECORD_PROVIDER } from '../domain/record.provider.interface';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import Lara from '@primeng/themes/lara';
import { Client } from 'appwrite';
import { providePrimeNG } from 'primeng/config';
import { UserService } from '../domain/user.service';
import { ActivityProviderService } from '../providers/activity.provider.service';
import { CLIENT, DB_ID } from '../providers/api.config';
import { RecordProviderService } from '../providers/record.provider.service';
import { ActivitiesEffects } from './stores/activities-store/activities.effects';
import { activitiesReducer } from './stores/activities-store/activities.reducer';
import { RecordsEffects } from './stores/record-store/record.effects';
import { recordsReducer } from './stores/record-store/record.reducer';


function  checkAuthentication(userService: UserService) : () => Promise<void> {
  return async () => {
    await userService.checkUser();
  }
}

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
       provide: CLIENT,
       useFactory: () => {
        const client = new Client()
        client.setProject('675daf91000a5b007d0c');
        return client;
       }
    },
    {
        provide: DB_ID,
        useValue: "675db0a800230f2466fe"
     },
     {
        provide:APP_INITIALIZER,
        useFactory:  (user: UserService) => checkAuthentication(user), 
        deps:[UserService],
        multi: true
  
     },
    provideStore(),
    provideState({ name: 'records', reducer: recordsReducer}),
    provideState({ name: 'activities', reducer: activitiesReducer}),
    provideEffects(RecordsEffects, ActivitiesEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
