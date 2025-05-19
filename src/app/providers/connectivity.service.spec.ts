import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { of } from 'rxjs';
import { ConnectivityService } from './connectivity.service';

describe('ConnectivityService', () => {
    let service: ConnectivityService;
    let platform: Platform;
    let network: Network;

    const platformMock = {
        is: jasmine.createSpy('is').and.returnValue(true), // Simulate on device by default
    };

    const networkMock = {
        onDisconnect: jasmine.createSpy('onDisconnect').and.returnValue(of({})),
        onConnect: jasmine.createSpy('onConnect').and.returnValue(of({})),
        type: 'wifi', // Default connection type
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ConnectivityService,
                { provide: Platform, useValue: platformMock },
                { provide: Network, useValue: networkMock },
            ],
        });
        service = TestBed.inject(ConnectivityService);
        platform = TestBed.inject(Platform);
        network = TestBed.inject(Network);
    });

    it('crea el servicio', () => {
        expect(service).toBeTruthy();
    });

    it('inicializa isConnected a true en el constructor', () => {
        expect(service.isConnected).toBeTrue();
    });

    describe('init', () => {
        it('deberia suscribir a network.onDisconnect y setear isConnected a false', () => {
            const disconnectSubscription = {
                subscribe: jasmine.createSpy('subscribe'),
            };
            (network.onDisconnect as jasmine.Spy).and.returnValue(
                disconnectSubscription
            );
            service.init();
            expect(network.onDisconnect).toHaveBeenCalled();
            expect(disconnectSubscription.subscribe).toHaveBeenCalled();

            // Simulate a disconnect event
            const disconnectCallback = (
                disconnectSubscription.subscribe as jasmine.Spy
            ).calls.argsFor(0)[0];
            disconnectCallback();
            expect(service.isConnected).toBeFalse();
        });

        it('debería suscribir a network.onConnect y definir isConnected a true', () => {
            const connectSubscription = {
                subscribe: jasmine.createSpy('subscribe'),
            };
            (network.onConnect as jasmine.Spy).and.returnValue(
                connectSubscription
            );
            service.init();
            expect(network.onConnect).toHaveBeenCalled();
            expect(connectSubscription.subscribe).toHaveBeenCalled();

            // Simulate a connect event
            const connectCallback = (
                connectSubscription.subscribe as jasmine.Spy
            ).calls.argsFor(0)[0];
            connectCallback();
            expect(service.isConnected).toBeTrue();
        });
    });

    describe('isOnline', () => {
        it('devuelve el valor actual de isConnected', () => {
            service.isConnected = true;
            expect(service.isOnline()).toBeTrue();
            service.isConnected = false;
            expect(service.isOnline()).toBeFalse();
        });
    });

    describe('isOffline', () => {
        it('devuelve el valor negado de isConnected', () => {
            service.isConnected = true;
            expect(service.isOffline()).toBeFalse();
            service.isConnected = false;
            expect(service.isOffline()).toBeTrue();
        });
    });
});
