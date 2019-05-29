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
        console.log('entra a create');
        return this.db.executeSql(sql, [tupla.IdEfector, tupla.Efector, tupla.IdEfectorSuperior, tupla.IdLocalidad, tupla.Localidad, tupla.IdArea, tupla.Area, tupla.IdZona, tupla.Zona, tupla.NivelComp, tupla.Periodo, tupla.RH_total, tupla.camas, tupla.Consultas, tupla.Guardia_con, tupla.Egresos, updated]);
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
                return Promise.resolve(datos);
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

    async talentoHumano(nivel) {
        let consulta = '';
        switch (nivel) {
            case 'provincia':
                consulta = 'SELECT SUM(RH) as talento FROM datosGestion';
                break;
            case 'zona':
                consulta = 'SELECT IdZona, SUM(RH) as talento FROM datosGestion GROUP BY IdZona';
                break;
            case 'localidad':
                consulta = 'SELECT IdLocalidad, SUM(RH) as talento FROM datosGestion GROUP BY IdLocalidad';
                break;
            case 'efector':
                consulta = 'SELECT IdEfector, SUM(RH) as talento FROM datosGestion GROUP BY IdEfector';
                break;
        }
        let datos = await this.db.executeSql(consulta, []);
        let rta = [];
        // let rta = datos.rows.item(0);
        for (let index = 0; index < datos.rows.length; index++) {
            rta.push(datos.rows.item(index));
        }
        return rta;
    }

    async talentoHumanoQuery(query) {
        // let consulta = '';
        // switch (nivel) {
        //   case 'provincia':
        //     consulta = 'SELECT SUM(RH_total) as talento FROM datosGestion';
        //     break;
        //   case 'zona':
        //     consulta = 'SELECT IdZona, SUM(RH_total) as talento FROM datosGestion GROUP BY IdZona';
        //     break;
        //   case 'localidad':
        //     consulta = 'SELECT IdLocalidad, SUM(RH_total) as talento FROM datosGestion GROUP BY IdLocalidad';
        //     break;
        //   case 'efector':
        //     consulta = 'SELECT IdEfector, SUM(RH_total) as talento FROM datosGestion GROUP BY IdEfector';
        //     break;
        // }

        let datos = await this.db.executeSql(query, []);
        let rta = [];
        // let rta = datos.rows.item(0);
        for (let index = 0; index < datos.rows.length; index++) {
            rta.push(datos.rows.item(index));
        }

        return rta;

    }

}
