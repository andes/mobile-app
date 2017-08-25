import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { ConnectivityProvider } from '../connectivity/connectivity';
import { Geolocation } from '@ionic-native/geolocation';
import { Map } from './map';

import config from '../../config';

declare var google;

@Injectable()
export class GoogleMapsProvider {
  apiKey = config.MAP_KEY;
  public onInit: Promise<any>;  

  constructor(
    public connectivityService: ConnectivityProvider,
    private geolocation: Geolocation) {    
  }

  loadGoogleMaps(): Promise<any> {
    this.onInit = new Promise((resolve, reject) => {
      if (typeof google == "undefined" || typeof google.maps == "undefined") {
        if (this.connectivityService.isOnline()) {

          window['mapInit'] = () => {
            console.log('Googlemaps loaded!');
            resolve(true);
          }

          let script = document.createElement("script");
          script.id = "googleMaps";

          if (this.apiKey) {
            script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&libraries=places&callback=mapInit';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }
          console.log('Googlemaps loading!');
          document.body.appendChild(script);

        } else {
          reject();
        }
      }
    });
    return this.onInit;
  }

  getGeolocation() {    
    return this.geolocation.getCurrentPosition();
  }

  watchPosition() {
    let options = {
      timeout: 50000
    }

    return this.geolocation.watchPosition(options);
  }

  createMap(mapElement: any, panelElement:any,  pleaseConnect: any) {
    return new Map(mapElement, panelElement, pleaseConnect);
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
debugger;
    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }  
}
