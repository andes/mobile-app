import { NavParams, Platform, AlertController } from '@ionic/angular';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { LocationsProvider } from 'src/providers/locations/locations';
import { GeoProvider } from 'src/providers/library-services/geo-provider';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
    selector: 'app-map',
    templateUrl: 'map.html',
    styles: [`
        google-map {
            height: 100%;
            width: 100%;
            display: block;
        }
    `],
})
export class MapPage implements OnDestroy {

    @ViewChild('gm') gm: GoogleMap;

    public centroSaludSeleccionado: any;
    public prestaciones: any = [];
    public centrosShow: any[] = [];

    public center: google.maps.LatLngLiteral = {
        lat: -38.951625,
        lng: -68.060341
    };

    public centerAraucania: google.maps.LatLngLiteral = {
        lat: -38.736779,
        lng: -72.598792
    };

    public userIcon: google.maps.Icon = {
        url: './assets/icon/user-marker.svg',
        scaledSize: new google.maps.Size(21, 30)
    };

    public locationIcon: google.maps.Icon = {
        url: './assets/icon/centro-salud-location.svg',
        scaledSize: new google.maps.Size(21, 30)
    };

    public mapOptions: google.maps.MapOptions = {
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels.text',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'poi.business',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'poi.school',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'poi.sports_complex',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'transit',
                stylers: [{ visibility: 'off' }]
            }
        ]
    };

    myPosition: google.maps.LatLngLiteral | null = null;
    lastWindow: MapInfoWindow | null = null;

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

    public zoom = 14;
    private locationsSubscriptions = null;
    public tipoMapa = '';

    constructor(
        private navParams: NavParams,
        private maps: GeoProvider,
        private platform: Platform,
        private locations: LocationsProvider,
        private diagnostic: Diagnostic,
        private device: Device,
        private alertCtrl: AlertController,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnDestroy() {
        if (this.locationsSubscriptions) {
            this.locationsSubscriptions.unsubscribe();
        }
    }

    onClickCentro(centro, infoWindow: MapInfoWindow, marker: MapMarker) {
        if (this.lastWindow) {
            this.lastWindow.close();
        }

        this.lastWindow = infoWindow;
        this.prestaciones = centro.ofertaPrestacional ? centro.ofertaPrestacional : [];
        infoWindow.open(marker);
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
            this.locationIcon = {
                url: `./assets/icon/${this.tipoMapa}-location.svg`,
                scaledSize: this.toGoogleSize(
                    this.markerSizes.find(size => size.name === this.tipoMapa)?.scaledSize
                )
            };
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
                        this.triggerMapResize();
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
                        }
                    );
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
            this.myPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            this.maps.setActual(position.coords);

            if (this.tipoMapa === 'centro-salud') {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            } else if (this.tipoMapa === 'araucania') {
                this.center = this.centerAraucania;
            }
        });
    }

    private triggerMapResize() {
        if (this.gm?.googleMap) {
            google.maps.event.trigger(this.gm.googleMap, 'resize');
        }
    }

    private toGoogleSize(size?: { width: number; height: number }): google.maps.Size | undefined {
        if (!size) {
            return undefined;
        }
        return new google.maps.Size(size.width, size.height);
    }
}
