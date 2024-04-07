import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ACTIVITY_PROVIDER } from '../domain/activity.provider.interface';
import { ActivityProviderService } from '../providers/activity.provider.service';
import { RECORD_PROVIDER } from '../domain/record.provider.interface';
import { ActivityRecordProvider } from '../providers/record.provider.service';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { recordsReducer } from './record-store/record.reducer';
import { RecordsEffects } from './record-store/record.effects';
export const appConfig: ApplicationConfig = {
  
  
  providers: [
    provideAnimations(),
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
    provideEffects(RecordsEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
