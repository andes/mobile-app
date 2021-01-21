import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
@Injectable()
export class PagesGestionProvider {
    private jsonURL = 'assets/files/data.json';

    constructor(private http: HttpClient) { }

    get() {
        return this.http.get(this.jsonURL);
    }
}
