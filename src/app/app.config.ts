import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {customeInterceptor} from "./service/Interceptor/custome.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([customeInterceptor])),
    provideAnimationsAsync('noop'),
    provideAnimationsAsync('noop'),
    provideAnimationsAsync(),]
}
