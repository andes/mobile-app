import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import * as moment from 'moment';
import { NetworkProvider } from '../../providers/network';
import { RupConsultorioPage } from 'pages/profesional/consultorio/rup-consultorio';

@Injectable()
export class DatosGestionProvider {

    db: SQLiteObject = null;

    constructor(public network: NetworkProvider) { }


    setDatabase(db: SQLiteObject) {
        if (this.db === null) {
            this.db = db;
        }
    }

    create(tupla: any) {
        let sql = 'INSERT INTO datosGestion(idEfector, Efector, IdEfectorSuperior, IdLocalidad, Localidad, IdArea, Area, IdZona, Zona, NivelComp, Periodo, RH, Camas, Consultas, Guardia_con, Egresos, updated)' +
            ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        let updated = moment().format('YYYY-MM-DD HH:mm');
        return this.db.executeSql(sql, [tupla.idEfector, tupla.Efector, tupla.IdEfectorSuperior, tupla.IdLocalidad, tupla.Localidad, tupla.IdArea, tupla.Area, tupla.IdZona, tupla.Zona, tupla.NivelComp, tupla.Periodo, tupla.RH, tupla.camas, tupla.Consultas, tupla.Guardia_con, tupla.Egresos, updated]);
    }

    createTable() {
        let sql = 'CREATE TABLE IF NOT EXISTS datosGestion(' +
            'IdEfector INTEGER, Efector VARCHAR(200), IdEfectorSuperior INTEGER, IdLocalidad INTEGER, Localidad  VARCHAR(400), IdArea INTEGER, Area VARCHAR(200), IdZona integer, Zona VARCHAR(200), ' +
            'NivelComp VARCHAR(50), Periodo DATE, RH INTEGER, Camas INTEGER, Consultas INTEGER, Guardia_con INTEGER, Egresos INTEGER, updated DATETIME)';
        return this.db.executeSql(sql, []);
    }

    delete() {
        let sql = 'DROP TABLE datosGestion';
        return this.db.executeSql(sql, []);
    }

    obtenerDatos() {
        let sql = 'SELECT * FROM datosGestion';
        return this.db.executeSql(sql, [])
            .then(response => {
                let datos = [];
                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return datos;
            })
            .catch(error => { return error });
    }

    update(task: any) {
        let sql = 'UPDATE datosGestion SET title=?, completed=? WHERE id=?';
        return this.db.executeSql(sql, [task.title, task.completed, task.id]);
    }

    borrarTabla() {
        let sql = 'DELETE FROM datosGestion';
        return this.db.executeSql(sql, []);
    }

    async migrarDatos() {
        await this.createTable();
        try {
            let datos: any = await this.network.getMobileApi('mobile/migrar/')
            let cant = datos.length;
            let arr = [];
            if (cant > 0) {
                arr = datos.map(async (data) => {
                    return this.create(data);
                });
                return Promise.all(arr);
            }
        } catch (error) {
            return (error);
        }
    }

}
