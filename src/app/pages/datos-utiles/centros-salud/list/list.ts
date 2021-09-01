import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationsProvider } from 'src/providers/locations/locations';
import { GeoProvider } from 'src/providers/geo-provider';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-list',
    templateUrl: 'list.html',
})
export class ListPage implements OnInit, OnDestroy {
    points: any[];
    position: any = {};
    lugares: any[];
    locationsSubscriptions: any;

    constructor(
        private route: ActivatedRoute,
        private locations: LocationsProvider,
        private gMaps: GeoProvider) {
    }


    ngOnDestroy() {
        if (this.locationsSubscriptions) {
            this.locationsSubscriptions.unsubscribe();
        }
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.locationsSubscriptions = this.locations.getV2().subscribe((centros: any) => {

                if (params.tipo === 'centro-salud') {
                    this.points = centros;
                } else if (params.tipo === 'detectar') {
                    this.points = centros.filter(unCentro => unCentro.configuraciones?.detectar === true);
                } else {
                    this.points = centros.filter(unCentro => unCentro.configuraciones?.vacunatorio === true);
                }

                if (this.gMaps.actualPosition) {
                    this.applyHaversine({ lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude });
                    this.points = this.points.slice(0, 5);
                } else {
                    this.gMaps.getGeolocation().then(position => {
                        this.applyHaversine({ lat: position.coords.latitude, lng: position.coords.longitude });
                        this.points = this.points.slice(0, 5);
                    });
                }
            });
        });
    }

    applyHaversine(userLocation) {
        for (const point of this.points) {
            const placeLocation = {
                lat: point.direccion.geoReferencia[0],
                lng: point.direccion.geoReferencia[1]
            };

            point.distance = this.gMaps.getDistanceBetweenPoints(
                userLocation,
                placeLocation,
                'km'
            ).toFixed(2);

            this.points.sort((locationA, locationB) => {
                return locationA.distance - locationB.distance;
            });
        }
    }

    private navigateTo(location) {
        window.open('geo:?q=' + location[0] + ',' + location[1]);
    }

    toMap(centro) {
        this.navigateTo(centro.direccion.geoReferencia);
    }

}
