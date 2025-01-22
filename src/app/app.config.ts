import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { 
  DashboardOutline,
  TeamOutline,
  SafetyCertificateOutline,
  DownOutline
} from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [
  DashboardOutline,
  TeamOutline,
  SafetyCertificateOutline,
  DownOutline
];

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNzI18n(en_US),
    importProvidersFrom(
      FormsModule,
      NzMessageModule,
      NzIconModule.forRoot(icons)
    ),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([apiInterceptor])
    ),
  ],
};
