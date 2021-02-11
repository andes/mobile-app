import { InformacionValidacionPage } from './informacion-validacion/informacion-validacion';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { DisclaimersProvider } from 'src/providers/auth/disclaimer';
import { DisclaimerPage } from './disclaimers/accept-disclaimer';
import { OrganizacionesPage } from './organizaciones/organizaciones';
import { AdsModule } from 'src/app/ads/ads.module';
import { RecuperarPasswordPage } from './recuperar-password/recuperar-password';
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        LoginPageRoutingModule,
        AdsModule
    ],
    declarations: [
        DisclaimerPage,
        LoginPage,
        OrganizacionesPage,
        RecuperarPasswordPage,
        InformacionValidacionPage
    ],
    providers: [
        DisclaimersProvider,
        Camera
    ],

})
export class LoginPageModule { }
