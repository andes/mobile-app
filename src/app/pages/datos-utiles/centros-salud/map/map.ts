import { NavParams, Platform, AlertController } from '@ionic/angular';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { LocationsProvider } from 'src/providers/locations/locations';
import { GeoProvider } from 'src/providers/geo-provider';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Device } from '@ionic-native/device/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { AgmInfoWindow, AgmMap } from '@agm/core';

@Component({
    selector: 'app-map',
    templateUrl: 'map.html',
    styles: [`
        agm-map {
            height: 100%;
            width: 100%;
        }
    `],
})

export class MapPage implements OnDestroy {

    @ViewChild('gm') gm: AgmMap;
    @ViewChild('infoWindow') infoWindow: AgmInfoWindow;

    /* Es el CS seleccionado en la lista de CS mas cercanos*/
    public centroSaludSeleccionado: any;
    public prestaciones: any = [];
    public centrosShow: any[] = [];
    public center = {
        latitude: -38.951625,
        longitude: -68.060341
    };

    public locationIcon: 'hospital-location.png' | 'detectar-location.png' = 'hospital-location.png';

    myPosition = null;


    lastWindow: AgmInfoWindow;

    constructor(
        private navParams: NavParams,
        private maps: GeoProvider,
        private platform: Platform,
        private locations: LocationsProvider,
        private diagnostic: Diagnostic,
        private device: Device,
        private alertCtrl: AlertController,
        private router: Router,
        private route: ActivatedRoute) {
    }

    public zoom = 14;
    private locationsSubscriptions = null;
    private detectar = false;

    ngOnDestroy() {
        if (this.locationsSubscriptions) {
            this.locationsSubscriptions.unsubscribe();
        }
    }

    onClickCentro(centro, infoWindow) {
        if (this.lastWindow) {
            this.lastWindow.close();
        }
        this.lastWindow = infoWindow;
        (centro.ofertaPrestacional) ? this.prestaciones = centro.ofertaPrestacional : this.prestaciones = [];
    }

    toPrestaciones(centro) {
        this.router.navigate(['cs-prestaciones'], { queryParams: { centroSalud: JSON.stringify(centro) } });
    }

    navigateTo(longitud, latitud) {
        if (this.platform.is('ios')) {
            window.open('maps://?q=' + longitud + ',' + latitud, '_system');
        }
        if (this.platform.is('android')) {
            window.open('geo:?q=' + longitud + ',' + latitud);
        }
    }

    ionViewDidEnter() {
        this.route.queryParams.subscribe(params => {
            if (params.detectar) {
                this.detectar = JSON.parse(params.detectar);
                this.locationIcon = 'detectar-location.png';
            } else {
                this.detectar = false;
                this.locationIcon = 'hospital-location.png';
            }
        });
        this.centroSaludSeleccionado = this.navParams.get('centroSeleccionado');
        this.platform.ready().then(() => {
            this.locationsSubscriptions = this.locations.getV2().subscribe((centros: any) => {
                this.centrosShow = this.detectar ? centros.filter(unCentro => unCentro.configuraciones?.detectar === true) : centros;
            });

            if (this.platform.is('cordova')) {
                this.diagnostic.isLocationEnabled().then((available) => {

                    if (!available) {
                        this.requestGeoRef();
                    } else {
                        this.geoPosicionarme();
                    }

                    setTimeout(() => {
                        this.gm.triggerResize();
                    }, 1000);
                }, (error) => {
                    console.error(error);
                });
            } else {
                this.geoPosicionarme();
            }
        }).catch((error: any) => {
            console.error(error);
        });
    }

    async requestGeoRef() {
        const alert = await this.alertCtrl.create({
            header: 'Acceder a ubicación',
            subHeader: 'Para poder utilizar este servicio, deberá activar la ubicación en su dispositivo.',
            buttons: [{
                text: 'Continuar',
                handler: () => {
                    this.diagnostic.switchToLocationSettings();
                    this.diagnostic.registerLocationStateChangeHandler(
                        (state) => {
                            this.hayUbicacion(state);
                        });
                }
            }]
        });
        await alert.present();
    }

    hayUbicacion(state) {
        if ((this.device.platform === 'Android' && state !== this.diagnostic.locationMode.LOCATION_OFF)
            || (this.device.platform === 'iOS') && (state === this.diagnostic.permissionStatus.GRANTED
                || state === this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE
            )) {
            this.geoPosicionarme();

        }
    }

    geoPosicionarme() {
        this.maps.getGeolocation().then((position: any) => {
            this.myPosition = position.coords;
            this.maps.setActual(this.myPosition);
            // Si me geolocaliza, centra el mapa donde estoy
            this.center.latitude = this.myPosition.latitude;
            this.center.longitude = this.myPosition.longitude;

        });
    }
}

