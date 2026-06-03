import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAngularSvgIcon(),
    provideAnimations(),

    importProvidersFrom(FontAwesomeModule),

    {
      provide: JWT_OPTIONS,
      useValue: {
        allowedDomains: ['localhost:8091'],
        disallowedRoutes: [],
      },
    },
    JwtModule,
  ],
};
