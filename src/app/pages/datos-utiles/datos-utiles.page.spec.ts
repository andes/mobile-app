import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosUtilesPage } from './datos-utiles.page';

describe('DatosUtilesPage', () => {
  let component: DatosUtilesPage;
  let fixture: ComponentFixture<DatosUtilesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosUtilesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosUtilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
