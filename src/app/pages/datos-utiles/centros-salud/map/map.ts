import { NavParams, Platform, AlertController } from '@ionic/angular';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { LocationsProvider } from 'src/providers/locations/locations';
import { GeoProvider } from 'src/providers/library-services/geo-provider';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMap } from '@angular/google-maps';

@Component({
    selector: 'app-map',
    templateUrl: 'map.html',
    styles: [`
        google-map {
            height: 100%;
            width: 100%;
        }
    `],
})
export class MapPage implements OnDestroy {
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

    public centroSaludSeleccionado: any;
    public prestaciones: any = [];
    public centrosShow: any[] = [];

    public center = {
        lat: -38.951625,
        lng: -68.060341
    };

    public centerAraucania = {
        lat: -38.736779,
        lng: -72.598792
    };

    public zoom = 14;
    public tipoMapa = '';
    public myPosition = null;
    private locationsSubscriptions = null;

    public mapOptions: google.maps.MapOptions = {
        disableDefaultUI: true,
        styles: [/* aquí insertas `this.mapStyles` si lo necesitas */]
    };

    constructor(
        private navParams: NavParams,
        private maps: GeoProvider,
        private platform: Platform,
        private locations: LocationsProvider,
        private diagnostic: Diagnostic,
        private device: Device,
        private alertCtrl: AlertController,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnDestroy() {
        if (this.locationsSubscriptions) {
            this.locationsSubscriptions.unsubscribe();
        }
    }

    ionViewDidEnter() {
        this.route.queryParams.subscribe(params => {
            this.tipoMapa = params.tipo;
        });

        this.centroSaludSeleccionado = this.navParams.get('centroSeleccionado');

        this.platform.ready().then(() => {
            this.centrosShow = [];

            if (this.tipoMapa === 'centro-salud') {
                this.locationsSubscriptions = this.locations.getV2().subscribe((centros: any) => {
                    this.centrosShow = centros.filter(unCentro => this.noTieneConfiguracionesMapa(unCentro));
                });
            } else if (this.tipoMapa === 'araucania') {
                this.locationsSubscriptions = this.locations.getCentrosAraucania().subscribe((centros: any) => {
                    this.centrosShow = centros;
                });
            }

            if (this.platform.is('cordova')) {
                this.diagnostic.isLocationEnabled().then((available) => {
                    if (!available) {
                        this.requestGeoRef();
                    } else {
                        this.geoPosicionarme();
                    }

                    setTimeout(() => {
                        this.map?.panTo(this.center);
                    }, 1000);
                }, (error) => {
                    console.error(error);
                });
            } else {
                this.geoPosicionarme();
            }
        });
    }

    noTieneConfiguracionesMapa(unCentro: any) {
        const conf = unCentro.configuraciones;
        return !conf || (!conf.vacunatorio && !conf.detectar);
    }

    async requestGeoRef() {
        const alert = await this.alertCtrl.create({
            header: 'Acceder a ubicación',
            subHeader: 'Para poder utilizar este servicio, deberá activar la ubicación en su dispositivo.',
            buttons: [{
                text: 'Continuar',
                handler: () => {
                    this.diagnostic.switchToLocationSettings();
                    this.diagnostic.registerLocationStateChangeHandler((state) => {
                        this.hayUbicacion(state);
                    });
                }
            }]
        });
        await alert.present();
    }

    hayUbicacion(state) {
        const isAndroid = this.device.platform === 'Android';
        const isIOS = this.device.platform === 'iOS';
        const granted = this.diagnostic.permissionStatus.GRANTED;

        if ((isAndroid && state !== this.diagnostic.locationMode.LOCATION_OFF)
            || (isIOS && (state === granted || state === this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE))) {
            this.geoPosicionarme();
        }
    }

    geoPosicionarme() {
        this.maps.getGeolocation().then((position: any) => {
            this.myPosition = position.coords;
            this.maps.setActual(this.myPosition);

            if (this.tipoMapa === 'centro-salud') {
                this.center = {
                    lat: this.myPosition.latitude,
                    lng: this.myPosition.longitude
                };
            } else if (this.tipoMapa === 'araucania') {
                this.center = this.centerAraucania;
            }

            this.map?.panTo(this.center);
        });
    }

    onClickCentro(centro: any) {
        (centro.ofertaPrestacional) ? this.prestaciones = centro.ofertaPrestacional : this.prestaciones = [];
    }

    toPrestaciones(centro) {
        this.router.navigate(['cs-prestaciones'], {
            queryParams: { centroSalud: JSON.stringify(centro) }
        });
    }

    navigateTo(longitud, latitud) {
        const url = this.platform.is('ios') ?
            `maps://?q=${longitud},${latitud}` :
            `geo:?q=${longitud},${latitud}`;

        window.open(url, '_system');
    }
}
