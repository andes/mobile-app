import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

declare var google;

@Injectable()
export class GoogleMapsProvider {
    public actualPosition = null;

    constructor(
        public platform: Platform,
        private geolocation: Geolocation) {
    }

    getGeolocation() {
        return this.geolocation.getCurrentPosition();
    }

    watchPosition() {
        let options = {
            timeout: 50000
        }
        if (this.platform.is('cordova')) {
            return this.geolocation.watchPosition(options).do(location => {
                this.actualPosition = location.coords;
            });
        } else {
            return new Observable(observer => {
                navigator.geolocation.watchPosition((location) => {
                    this.actualPosition = location.coords;
                    observer.next(location);
                })
            });
        }
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
