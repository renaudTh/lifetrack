import { InjectionToken } from '@angular/core';

export interface EnvironmentInterface {
  auth0: {
    clientId: string;
    domain: string;
    audience: string;
  };
  apiUrl: string;
}

export const API_URL = new InjectionToken<string>('api.url');
