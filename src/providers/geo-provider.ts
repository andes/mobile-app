import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class GeoProvider {
    public actualPosition = null;

    constructor(
        public platform: Platform,
        private geolocation: Geolocation) {
    }

    getGeolocation() {
        return this.geolocation.getCurrentPosition();
    }

    setActual(position) {
        this.actualPosition = position;
    }

    watchPosition() {
        const options = {
            timeout: 50000
        };
        if (this.platform.is('cordova')) {
            return this.geolocation.watchPosition(options);
        } else {
            return new Observable(observer => {
                navigator.geolocation.watchPosition((location) => {
                    this.actualPosition = location.coords;
                    observer.next(location);
                });
            });
        }
    }

    getDistanceBetweenPoints(start, end, units) {

        const earthRadius = {
            miles: 3958.8,
            km: 6371
        };

        const R = earthRadius[units || 'km'];
        const lat1 = start.lat;
        const lon1 = start.lng;
        const lat2 = end.lat;
        const lon2 = end.lng;

        const dLat = this.toRad((lat2 - lat1));
        const dLon = this.toRad((lon2 - lon1));
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;

    }

    toRad(x) {
        return x * Math.PI / 180;
    }
}
