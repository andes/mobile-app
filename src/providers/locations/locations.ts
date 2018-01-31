import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// import { Geolocation } from '@ionic-native/geolocation';

// providers
import { NetworkProvider } from '../network';

@Injectable()
export class LocationsProvider {
  centros: any[] = null;
  private baseUrl = 'core/tm';

  constructor(public network: NetworkProvider, public http: Http) { }

  get() {
    if (this.centros) {
      return Promise.resolve(this.centros);
    }

    return this.network.get(this.baseUrl + '/organizacionesCache').then((data: any[]) => {
      this.centros = data;
      return Promise.resolve(data);
    }).catch(() => Promise.reject(null));
  }

  load() {



    if (this.centros) {
      return Promise.resolve(this.centros);
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
