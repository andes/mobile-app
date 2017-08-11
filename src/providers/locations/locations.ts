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
  userLocation: any = {};

  constructor(private geolocation: Geolocation, public http: Http) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLocation = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      debugger;


    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  load(usLoca) {
    this.userLocation = usLoca;
    debugger;
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.userLocation = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        };

        this.http.get('assets/data/locations.json').map(res => res.json()).subscribe(data => {

          this.data = this.applyHaversine(data.locations, this.userLocation);
          debugger;
          this.data.sort((locationA, locationB) => {
            return locationA.distance - locationB.distance;
          });

          resolve(this.data);
        });

      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLocation = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };

      return this.userLocation;

    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  applyHaversine(locations, userLocation) {

    // let usersLocation = {
    //   // lat: -38.945051899999996,
    //   // lng: -68.0779378
    // };
    // usersLocation = this.userLocation;

    // this.geolocation.getCurrentPosition().then((resp) => {
    //   usersLocation = {
    //     lat: resp.coords.latitude,
    //     lng: resp.coords.longitude
    //   };
    debugger;
    locations.map((location) => {
      let placeLocation = {
        lat: location.latitude,
        lng: location.longitude
      };
      debugger;
      location.distance = this.getDistanceBetweenPoints(
        userLocation,
        placeLocation,
        'km'
      ).toFixed(2);
    });

    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
    debugger;
    return locations;
  }

  getDistanceBetweenPoints(start, end, units) {

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'km'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }
}
