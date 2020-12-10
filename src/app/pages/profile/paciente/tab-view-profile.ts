import { Component, } from '@angular/core';
import { ErrorReporterProvider } from 'src/providers/errorReporter';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tab-view-profle',
    templateUrl: 'tab-view-profile.html',
})
export class TabViewProfilePage {
    subtitle = '';

    constructor(
        private router: Router,
        public reporter: ErrorReporterProvider) {
    }

    ionViewDidLoad() {
        this.reporter.alert();
    }

    profile(){
        this.router.navigate(['view-profile/profile-paciente']);
    }

    onBugReport() {
        this.reporter.report();
    }

}
