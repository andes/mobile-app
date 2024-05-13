import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { newHomePage } from './new-home.page';
import { HomePage } from './home-page';

const routes: Routes = [
    {
        path: '',
        component: newHomePage,
    },
    {
        path: 'paciente',
        component: HomePage,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HomePageRoutingModule { }
