import { NavParams, Platform, AlertController } from '@ionic/angular';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { LocationsProvider } from 'src/providers/locations/locations';
import { GeoProvider } from 'src/providers/geo-provider';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
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

    public centerAraucania = {
        latitude: -38.736779,
        longitude: -72.598792
    };

    public userIcon = {
        url: './assets/icon/user-marker.svg',
        scaledSize: {
            width: 21,
            height: 30
        }
    };
    public locationIcon = {
        url: './assets/icon/centro-salud-location.svg',
        scaledSize: {
            width: 21,
            height: 30
        },

    };

    // Configuración para esconder elementos en el mapa (los mostramos con íconos propios)
    public mapStyles = [
        {
            featureType: 'poi',
            elementType: 'labels.text',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'poi.business',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'poi.school',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'poi.sports_complex',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'road',
            elementType: 'labels.icon',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'transit',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        }
    ];

    myPosition = null;
    lastWindow: AgmInfoWindow;

    // Tamaños corregidos según tipo de ícono
    // #32b9ec
    markerSizes = [
        {
            name: 'centro-salud',
            scaledSize: {
                width: 21,
                height: 30
            }
        },
        {
            name: 'araucania',
            scaledSize: {
                width: 21,
                height: 30
            }
        },
        {
            name: 'vacunatorio',
            scaledSize: {
                width: 70,
                height: 90
            }
        },
    ];

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
    public tipoMapa = '';

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
            this.tipoMapa = params.tipo;
            this.locationIcon.url = `./assets/icon/${this.tipoMapa}-location.svg`;
            this.locationIcon.scaledSize = this.markerSizes.find(size => size.name === this.tipoMapa).scaledSize;
        });

        this.centroSaludSeleccionado = this.navParams.get('centroSeleccionado');
        this.platform.ready().then(() => {
            this.centrosShow = [];
            if (this.tipoMapa === 'centro-salud') {
                this.locationsSubscriptions = this.locations.getV2().subscribe((centros: any) => {
                    this.centrosShow = centros.filter(unCentro => this.noTieneConfiguracionesMapa(unCentro));
                });
            } else {
                if (this.tipoMapa === 'araucania') {
                    this.locationsSubscriptions = this.locations.getCentrosAraucania().subscribe((centros: any) => {
                        this.centrosShow = centros;
                    });
                }
            }

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
    noTieneConfiguracionesMapa(unCentro: any) {
        if (!unCentro.configuraciones || unCentro.configuraciones &&
            (!unCentro.configuraciones.vacunatorio || !unCentro.configuraciones.detectar)) {
            return true;
        }
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
            if (this.tipoMapa === 'centro-salud') {
                // Si me geolocaliza, centra el mapa donde estoy
                this.center.latitude = this.myPosition.latitude;
                this.center.longitude = this.myPosition.longitude;
            } else {
                if (this.tipoMapa === 'araucania') {
                    this.center = this.centerAraucania;
                }

            }


        });
    }
}

