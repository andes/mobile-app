import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VacunasPage } from './vacunas.page';

describe('VacunasPage', () => {
  let component: VacunasPage;
  let fixture: ComponentFixture<VacunasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacunasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VacunasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
