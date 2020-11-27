import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisFamiliaresPage } from './mis-familiares.page';

describe('MisFamiliaresPage', () => {
  let component: MisFamiliaresPage;
  let fixture: ComponentFixture<MisFamiliaresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisFamiliaresPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisFamiliaresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
