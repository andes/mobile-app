import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DatabaseProvider {

  db: SQLiteObject = null;

  constructor(public http: Http) {
    console.log('Hello DatabaseProvider Provider');
  }

  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }

  createTable() {
    debugger;
    let sql = 'CREATE TABLE IF NOT EXISTS usuarios (idUsuario INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, apellido TEXT, usuario TEXT, telefono INTEGER)';
    return this.db.executeSql(sql, []);
  }

  // registro(modelo) {
  //   debugger;
  //   let sql = 'INSERT INTO usuarios (nombre, apellido, usuario, telefono) VALUES(?,?,?,?)';
  //   return this.db.executeSql(sql, [modelo.nombre, modelo.apellido, modelo.usuario, modelo.telefono]);
  // }

  getUsuarios() {
    let sql = 'SELECT * FROM usuarios';
    return this.db.executeSql(sql, [])
      .then(response => {
        let usuarios = [];
        for (let index = 0; index < response.rows.length; index++) {
          usuarios.push(response.rows.item(index));
        }
        return Promise.resolve(usuarios);
      })
      .catch(error => Promise.reject(error));
  }
}
