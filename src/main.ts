
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ENV } from '@app/env';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);

const script = document.getElementById('googleMaps') as HTMLScriptElement;
script.src = `https://maps.googleapis.com/maps/api/js?key=${ENV.MAP_KEY}`;
script.async = true;
script.defer = true;
