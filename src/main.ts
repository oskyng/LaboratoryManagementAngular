import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { APP_ROUTES } from './app/app.routes';
import { appConfig } from './app/app.config';
import { MainLayoutComponent } from './app/core/layout/main-layout.component';

bootstrapApplication(MainLayoutComponent, {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(),
    ...appConfig.providers
  ]
}).catch(err => console.error(err));

