import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { GestionPage } from './gestion.page';
import { AuthProvider } from 'src/providers/auth/auth';
import { DeviceProvider } from 'src/providers/auth/device';
import { NetworkProvider } from 'src/providers/network';
import { ToastProvider } from 'src/providers/toast';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from 'src/providers/pageGestion';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/providers/events.service';
import { of } from 'rxjs';
import * as moment from 'moment';

describe('GestionPage', () => {
    let component: GestionPage;
    let fixture: ComponentFixture<GestionPage>;
    let deviceProvider: DeviceProvider;
    let authService: AuthProvider;
    let toastProvider: ToastProvider;
    let pagesGestionProvider: PagesGestionProvider;
    let datosGestion: DatosGestionProvider;
    let network: NetworkProvider;
    let events: EventsService;
    let router: Router;
    let activatedRoute: ActivatedRoute;

    const deviceProviderMock = {
        remove: jasmine
            .createSpy('remove')
            .and.returnValue(Promise.resolve(true)),
    };

    const authServiceMock = {
        user: { email: 'test@example.com', password: 'password' },
        actualizarToken: jasmine
            .createSpy('actualizarToken')
            .and.returnValue(Promise.resolve('newToken')),
        logout: jasmine.createSpy('logout'),
        updateAccount: jasmine
            .createSpy('updateAccount')
            .and.returnValue(Promise.resolve()),
    };

    const toastProviderMock = {
        danger: jasmine.createSpy('danger'),
    };

    const pagesGestionProviderMock = {
        get: jasmine
            .createSpy('get')
            .and.returnValue(of({ '1': { template: 'default' } })),
    };

    const datosGestionMock = {
        maxPeriodo: jasmine
            .createSpy('maxPeriodo')
            .and.returnValue(Promise.resolve('2023')),
        desdePeriodoMortalidad: jasmine
            .createSpy('desdePeriodoMortalidad')
            .and.returnValue(Promise.resolve('2022')),
        hastaPeriodoMortalidad: jasmine
            .createSpy('hastaPeriodoMortalidad')
            .and.returnValue(Promise.resolve('2024')),
        obtenerDatos: jasmine
            .createSpy('obtenerDatos')
            .and.returnValue(
                Promise.resolve([
                    { updated: moment().subtract(1, 'day').toDate() },
                ])
            ),
        obtenerDatosProf: jasmine
            .createSpy('obtenerDatosProf')
            .and.returnValue(Promise.resolve([])),
        obtenerDatosMortalidad: jasmine
            .createSpy('obtenerDatosMortalidad')
            .and.returnValue(Promise.resolve([])),
        obtenerDatosAutomotores: jasmine
            .createSpy('obtenerDatosAutomotores')
            .and.returnValue(Promise.resolve([])),
        migrarDatos: jasmine
            .createSpy('migrarDatos')
            .and.returnValue(Promise.resolve(true)),
        delete: jasmine
            .createSpy('delete')
            .and.returnValue(Promise.resolve(true)),
        deleteProf: jasmine
            .createSpy('deleteProf')
            .and.returnValue(Promise.resolve(true)),
        createTable: jasmine
            .createSpy('createTable')
            .and.returnValue(Promise.resolve()),
        createTableProf: jasmine
            .createSpy('createTableProf')
            .and.returnValue(Promise.resolve()),
        createTableMortalidad: jasmine
            .createSpy('createTableMortalidad')
            .and.returnValue(Promise.resolve()),
        createTableAutomotores: jasmine
            .createSpy('createTableAutomotores')
            .and.returnValue(Promise.resolve()),
        createTableComunidades: jasmine
            .createSpy('createTableComunidades')
            .and.returnValue(Promise.resolve()),
        createTableMinuta: jasmine
            .createSpy('createTableMinuta')
            .and.returnValue(Promise.resolve()),
        createTableRegistroProblemas: jasmine
            .createSpy('createTableRegistroProblemas')
            .and.returnValue(Promise.resolve()),
        createTableImagenesProblema: jasmine
            .createSpy('createTableImagenesProblema')
            .and.returnValue(Promise.resolve()),
    };

    const networkMock = {
        getCurrentNetworkStatus: jasmine
            .createSpy('getCurrentNetworkStatus')
            .and.returnValue('online'),
    };

    const eventsMock = {
        setTipoIngreso: jasmine.createSpy('setTipoIngreso'),
        checkTipoIngreso: jasmine.createSpy('checkTipoIngreso'),
    };

    const routerMock = {
        navigate: jasmine
            .createSpy('navigate')
            .and.returnValue(Promise.resolve(true)),
    };

    const activatedRouteMock = {
        queryParams: of({
            page: '1',
            data: JSON.stringify({ some: 'data' }),
            id: 'someId',
            titulo: 'Some Title',
            origen: 'someOrigin',
            registroProblema: 'someProblem',
        }),
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GestionPage],
            imports: [IonicModule.forRoot()],
            providers: [
                { provide: DeviceProvider, useValue: deviceProviderMock },
                { provide: AuthProvider, useValue: authServiceMock },
                { provide: ToastProvider, useValue: toastProviderMock },
                {
                    provide: PagesGestionProvider,
                    useValue: pagesGestionProviderMock,
                },
                { provide: DatosGestionProvider, useValue: datosGestionMock },
                { provide: NetworkProvider, useValue: networkMock },
                { provide: EventsService, useValue: eventsMock },
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GestionPage);
        component = fixture.componentInstance;
        deviceProvider = TestBed.inject(DeviceProvider);
        authService = TestBed.inject(AuthProvider);
        toastProvider = TestBed.inject(ToastProvider);
        pagesGestionProvider = TestBed.inject(PagesGestionProvider);
        datosGestion = TestBed.inject(DatosGestionProvider);
        network = TestBed.inject(NetworkProvider);
        events = TestBed.inject(EventsService);
        router = TestBed.inject(Router);
        activatedRoute = TestBed.inject(ActivatedRoute);
        fixture.detectChanges();
    }));

    it('crea el componente', () => {
        expect(component).toBeTruthy();
    });

    describe('ionViewWillEnter', () => {
        it('inicializacion del componente', () => {
            spyOn(component, 'init');
            component.ionViewWillEnter();
            expect(component.init).toHaveBeenCalled();
        });
    });

    describe('init', () => {
        it('llamado a recargar con query params', async () => {
            spyOn(component, 'recargar');
            await component.init();
            expect(component.recargar).toHaveBeenCalledWith({
                page: '1',
                data: JSON.stringify({ some: 'data' }),
                id: 'someId',
                titulo: 'Some Title',
                origen: 'someOrigin',
                registroProblema: 'someProblem',
            });
        });
    });

    describe('recargar', () => {
        it('deberia setear propiedades de params y llamar a pagesGestionProvider', async () => {
            await component.recargar({
                page: '2',
                data: JSON.stringify({ another: 'data' }),
                id: 'otherId',
                titulo: 'Other Title',
                origen: 'otherOrigin',
                registroProblema: 'otherProblem',
            });
            expect(component.numActivePage).toBe('2');
            expect(component.dataPage).toEqual({ another: 'data' });
            expect(component.id).toBe('otherId');
            expect(component.titulo).toBe('Other Title');
            expect(component.origen).toBe('otherOrigin');
            expect(component.problema).toBe('otherProblem');
            expect(pagesGestionProvider.get).toHaveBeenCalled();
        });

        it('deberia llamar actualizarDatos si activePage template es provincia', async () => {
            (pagesGestionProvider.get as jasmine.Spy).and.returnValue(
                of({ '1': { template: 'provincia' } })
            );
            spyOn(component, 'actualizarDatos').and.returnValue(
                Promise.resolve()
            );
            await component.recargar({ page: '1' });
            expect(component.actualizarDatos).toHaveBeenCalledWith(false);
        });

        it('deberia llamar metodos de datosGestion si periodo no existe', async () => {
            component.periodo = null;
            await component.recargar({});
            expect(datosGestion.maxPeriodo).toHaveBeenCalled();
        });

        it('deberia llamar metodos de datosGestion si el periodo de mortalidad no existe', async () => {
            component.perDesdeMort = null;
            component.perHastaMort = null;
            await component.recargar({});
            expect(datosGestion.desdePeriodoMortalidad).toHaveBeenCalled();
            expect(datosGestion.hastaPeriodoMortalidad).toHaveBeenCalled();
        });

        it('deberia llamar events.checkTipoIngreso', async () => {
            await component.recargar({});
            expect(events.checkTipoIngreso).toHaveBeenCalledWith('gestion');
        });
    });

    describe('isLogin', () => {
        xit('devuelve true si authService.user existe', () => {
            expect(component.isLogin()).toBeTrue();
        });

        it('devuelve false si authService.user no existe', () => {
            (authService as any).user = null;
            expect(component.isLogin()).toBeFalse();
        });
    });

    describe('volver', () => {
        it('verificar que navege a login/disclaimer', () => {
            component.volver();
            expect(router.navigate).toHaveBeenCalledWith(['login/disclaimer']);
        });
    });

    describe('paginaActiva', () => {
        it('retorna la pagina activa de pagesList', () => {
            const mockPages = {
                '1': { template: 'test' },
                '2': { template: 'another' },
            };
            component.pagesList = mockPages;
            expect(component.paginaActiva('2')).toEqual({
                template: 'another',
            });
        });
    });

    describe('limpiarDatos', () => {
        it('llama a datosGestion.delete y datosGestion.deleteProf', async () => {
            await component.limpiarDatos();
            expect(datosGestion.delete).toHaveBeenCalled();
            expect(datosGestion.deleteProf).toHaveBeenCalled();
        });
    });

    describe('actualizarDatos', () => {
        it('llama a crearTablasSqlite', async () => {
            spyOn(component, 'crearTablasSqlite').and.returnValue(
                Promise.resolve()
            );
            await component.actualizarDatos(false);
            expect(component.crearTablasSqlite).toHaveBeenCalled();
        });

        it('llama a datosGestion.migrarDatos si esta online y actualizar es true', async () => {
            await component.actualizarDatos(true);
            expect(datosGestion.migrarDatos).toHaveBeenCalled();
        });

        it('mostar toast de error si esta offline', async () => {
            (network.getCurrentNetworkStatus as jasmine.Spy).and.returnValue(
                'offline'
            );
            await component.actualizarDatos(false);
            expect(toastProvider.danger).toHaveBeenCalledWith(
                'No hay conexión a internet'
            );
        });

        it('actualizacion de periodo, perDesdeMort y perHastaMort', async () => {
            await component.actualizarDatos(false);
            expect(datosGestion.maxPeriodo).toHaveBeenCalled();
            expect(datosGestion.desdePeriodoMortalidad).toHaveBeenCalled();
            expect(datosGestion.hastaPeriodoMortalidad).toHaveBeenCalled();
        });
    });

    describe('crearTablasSqlite', () => {
        it('llama a todos los metodos de datosGestion.createTable', async () => {
            await component.crearTablasSqlite();
            expect(datosGestion.createTable).toHaveBeenCalled();
            expect(datosGestion.createTableProf).toHaveBeenCalled();
            expect(datosGestion.createTableMortalidad).toHaveBeenCalled();
            expect(datosGestion.createTableAutomotores).toHaveBeenCalled();
            expect(datosGestion.createTableComunidades).toHaveBeenCalled();
            expect(datosGestion.createTableMinuta).toHaveBeenCalled();
            expect(
                datosGestion.createTableRegistroProblemas
            ).toHaveBeenCalled();
            expect(datosGestion.createTableImagenesProblema).toHaveBeenCalled();
        });
    });
});
