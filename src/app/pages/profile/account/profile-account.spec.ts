import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileAccountPage } from './profile-account';

describe('ProfileAccountPage', () => {
    let component: ProfileAccountPage;
    let fixture: ComponentFixture<ProfileAccountPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProfileAccountPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileAccountPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
