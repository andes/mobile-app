import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Geolocation } from '@ionic-native/geolocation';
/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationsProvider {
  data: any;

  constructor(private geolocation: Geolocation, public http: Http) { }

  load() {

    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      // this.geolocation.getCurrentPosition().then((resp) => {

      //   let userLocation = {
      //     lat: resp.coords.latitude,
      //     lng: resp.coords.longitude
      //   };

      this.http.get('assets/data/locations.json').map(res => res.json()).subscribe(data => {

        // this.data = this.applyHaversine(data.locations, userLocation);

        // this.data.sort((locationA, locationB) => {
        //   return locationA.distance - locationB.distance;
        // });

        resolve(data.locations);
      });

      // });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
