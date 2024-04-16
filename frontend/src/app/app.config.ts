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
import { recordsReducer } from './stores/record-store/record.reducer';
import { RecordsEffects } from './stores/record-store/record.effects';
import { activitiesReducer } from './stores/activities-store/activities.reducer';
import { ActivitiesEffects } from './stores/activities-store/activities.effects';
import { createClient } from '@supabase/supabase-js';
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
    provideState({ name: 'activities', reducer: activitiesReducer}),
    provideEffects(RecordsEffects, ActivitiesEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    {
        provide: "SUPABASE_CLIENT",
        useFactory: () => createClient("https://ntpiboyecoeeuabgggbq.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cGlib3llY29lZXVhYmdnZ2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5Nzk5MzIsImV4cCI6MjAyNTU1NTkzMn0.wkQurbr3xBPMr5d8j54NYxVUQ-tm4uPk3ttiTvdQHmk")

    }
]
};
