import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



@Injectable()
export class PagesGestionProvider {

    private _jsonURL = 'assets/files/data.json';


    constructor(public http: Http) { }


    get() {
        return this.http.get(this._jsonURL).map(res => res.json());
    }


}
