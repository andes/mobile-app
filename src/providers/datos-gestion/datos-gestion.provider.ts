import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatosGestionProvider {

  // public properties

  db: SQLiteObject = null;

  constructor() { }

  // public methods

  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }

  create(tupla: any) {
    let sql = 'INSERT INTO datosGestion(idEfector, rh, camas, consultas, guardia, egresos) VALUES(?,?,?,?,?,?)';
    return this.db.executeSql(sql, [tupla.idEfector, tupla.rh, tupla.camas, tupla.consultas, tupla.guardia, tupla.egresos]);
  }

  createTable() {
    let sql = 'CREATE TABLE IF NOT EXISTS datosGestion(idEfector INTEGER, rh INTEGER, camas INTEGER, consultas INTEGER, guardia INTEGER, egresos INTEGER)';
    return this.db.executeSql(sql, []);
  }

  delete(task: any) {
    let sql = 'DELETE FROM datosGestion WHERE id=?';
    return this.db.executeSql(sql, [task.id]);
  }

  obtenerDatos() {
    let sql = 'SELECT * FROM datosGestion';
    return this.db.executeSql(sql, [])
      .then(response => {
        let datos = [];
        for (let index = 0; index < response.rows.length; index++) {
          datos.push(response.rows.item(index));
        }
        return Promise.resolve(datos);
      })
      .catch(error => Promise.reject(error));
  }

  update(task: any) {
    let sql = 'UPDATE datosGestion SET title=?, completed=? WHERE id=?';
    return this.db.executeSql(sql, [task.title, task.completed, task.id]);
  }

  borrarTabla() {
    let sql = 'DELETE FROM datosGestion';
    return this.db.executeSql(sql, []);
  }

}
