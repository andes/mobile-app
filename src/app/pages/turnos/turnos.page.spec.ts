import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TurnosPage } from './turnos.page';

describe('TurnosPage', () => {
  let component: TurnosPage;
  let fixture: ComponentFixture<TurnosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TurnosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
