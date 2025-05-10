import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams, PopoverController } from '@ionic/angular';
import { PopoverPage } from './popover.page';
import { AuthProvider } from './../../../../providers/auth/auth';
import { of } from 'rxjs';

describe('PopoverPage', () => {
    let component: PopoverPage;
    let fixture: ComponentFixture<PopoverPage>;
    let navParams: NavParams;
    let authProvider: AuthProvider;
    let popoverController: PopoverController;

    const navParamsMock = {
        get: jasmine.createSpy('get').and.returnValues(
            'someOrigin', // Para 'origen'
            () => {} // Para 'callback'
        ),
    };

    const authProviderMock = {
        user: {
            cargo: 'SomeCargo',
        },
        checkCargo: jasmine.createSpy('checkCargo').and.returnValue(false),
    };

    const popoverControllerMock = {
        dismiss: jasmine
            .createSpy('dismiss')
            .and.returnValue(Promise.resolve()),
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PopoverPage],
            imports: [IonicModule.forRoot()],
            providers: [
                { provide: NavParams, useValue: navParamsMock },
                { provide: AuthProvider, useValue: authProviderMock },
                { provide: PopoverController, useValue: popoverControllerMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PopoverPage);
        component = fixture.componentInstance;
        navParams = TestBed.inject(NavParams);
        authProvider = TestBed.inject(AuthProvider);
        popoverController = TestBed.inject(PopoverController);
        fixture.detectChanges();
    }));

    it('creación de componente', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('deberia obtener el user de AuthProvider', () => {
            component.ngOnInit();
            expect(component.user).toEqual({ cargo: 'SomeCargo' });
        });

        it('llama a authProvider.checkCargo para Director y JefeZona', () => {
            component.ngOnInit();
            expect(authProvider.checkCargo).toHaveBeenCalledWith('Director');
            expect(authProvider.checkCargo).toHaveBeenCalledWith('JefeZona');
        });

        it('define esDirector y esJefeZona en base a authProvider.checkCargo', () => {
            (authProvider.checkCargo as jasmine.Spy).and.returnValues(
                true,
                false
            );
            component.ngOnInit();
            expect(component.esDirector).toBeTrue();
            expect(component.esJefeZona).toBeFalse();
        });

        it('define cargaMinuta en true si el origen no es ni zona ni Efector', () => {
            (navParamsMock.get as jasmine.Spy)
                .withArgs('origen')
                .and.returnValue('otro');
            component.ngOnInit();
            expect(component.cargaMinuta).toBeTrue();
        });

        it('define cargaMinuta en false si origin es zona', () => {
            (navParamsMock.get as jasmine.Spy)
                .withArgs('origen')
                .and.returnValue('zona');
            component.ngOnInit();
            expect(component.cargaMinuta).toBeFalse();
        });

        it('define cargaMinuta a false si el origin es Efector', () => {
            (navParamsMock.get as jasmine.Spy)
                .withArgs('origen')
                .and.returnValue('Efector');
            component.ngOnInit();
            expect(component.cargaMinuta).toBeFalse();
        });
    });

    describe('close', () => {
        it('deberia cerrar el popover', () => {
            component.close('someAction');
            expect(popoverController.dismiss).toHaveBeenCalled();
        });

        it('llama a callback function con la accion provista', () => {
            const callbackSpy = jasmine.createSpy('callback');
            (navParamsMock.get as jasmine.Spy)
                .withArgs('callback')
                .and.returnValue(callbackSpy);
            component.ngOnInit(); // Need to call ngOnInit to set the callback
            component.close('someAction');
            expect(callbackSpy).toHaveBeenCalledWith('someAction');
        });
    });
});
