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
        let sql = `INSERT INTO datosGestion(IdEfector, Efector, IdEfectorSuperior, IdLocalidad, Localidad, IdArea, Area, IdZona, Zona, NivelComp, Periodo,
            Total_TH,TH_Oper,TH_Tec,TH_Prof,TH_Asis,TH_Admin, TH_Medicos, TH_Enf, INV_GastoPer,INV_BienesUso, INV_BienesCons, INV_ServNoPers, RED_Complejidad, RED_Centros, RED_PuestosSanit,
        RED_Camas, Vehiculos, OB_Monto, OB_Detalle,OB_Estado, SD_Poblacion, SD_Mujeres, SD_Varones, SD_Muj_15a49, SD_Menores_6,
        PROD_Consultas, PROD_ConGuardia, PROD_PorcConGuardia, PROD_Egresos, updated)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        let updated = moment().format('YYYY-MM-DD HH:mm');
        try {
            return this.db.executeSql(sql, [tupla.IdEfector, tupla.Efector, tupla.IdEfectorSuperior, tupla.IdLocalidad, tupla.Localidad, tupla.IdArea, tupla.Area, tupla.IdZona, tupla.Zona, tupla.NivelComp, tupla.Periodo,
            tupla.Total_TH, tupla.TH_Oper, tupla.TH_Tec, tupla.TH_Prof, tupla.TH_Asis, tupla.TH_Admin, tupla.TH_Medicos, tupla.TH_Enf, tupla.INV_GastoPer, tupla.INV_BienesUso,
            tupla.INV_BienesCons, tupla.INV_ServNoPers, tupla.RED_Complejidad, tupla.RED_Centros, tupla.RED_PuestosSanit,
            tupla.RED_Camas, tupla.Vehiculos, tupla.OB_Monto, tupla.OB_Detalle, tupla.OB_Estado, tupla.SD_Poblacion, tupla.SD_Mujeres,
            tupla.SD_Varones, tupla.SD_Muj_15a49, tupla.SD_Menores_6, tupla.PROD_Consultas, tupla.PROD_ConGuardia,
            tupla.PROD_PorcConGuardia, tupla.PROD_Egresos, updated]);
        } catch (err) {
            return (err);
        }

    }

    createTable() {
        let sql = 'CREATE TABLE IF NOT EXISTS datosGestion(IdEfector INTEGER, Efector VARCHAR(200), IdEfectorSuperior INTEGER, IdLocalidad INTEGER, ' +
            'Localidad  VARCHAR(400), IdArea INTEGER, Area VARCHAR(200), IdZona integer, Zona VARCHAR(200), ' +
            'NivelComp VARCHAR(50), Periodo DATE,' +
            'Guardia_con INTEGER, Egresos INTEGER, Total_TH  INTEGER,TH_Oper INTEGER,TH_Tec INTEGER,TH_Prof INTEGER,TH_Asis INTEGER,' +
            'TH_Admin INTEGER, TH_Medicos INTEGER, TH_Enf INTEGER, INV_GastoPer INTEGER, ' +
            'INV_BienesUso INTEGER, INV_BienesCons INTEGER, INV_ServNoPers INTEGER,' +
            'RED_Complejidad INTEGER, RED_Centros INTEGER, RED_PuestosSanit INTEGER,' +
            'RED_Camas INTEGER, Vehiculos INTEGER, OB_Monto INTEGER, OB_Detalle INTEGER, ' +
            'OB_Estado INTEGER, SD_Poblacion INTEGER, SD_Mujeres INTEGER, SD_Varones INTEGER, SD_Muj_15a49 INTEGER, SD_Menores_6 INTEGER,' +
            'PROD_Consultas INTEGER, PROD_ConGuardia INTEGER, PROD_PorcConGuardia INTEGER, PROD_Egresos INTEGER, updated DATETIME)';
        try {
            return this.db.executeSql(sql, []);

        } catch (err) {
            return (err);
        }
    }

    delete() {
        let sql = 'DROP TABLE datosGestion';
        try {
            return this.db.executeSql(sql, []);
        } catch (err) {
            return (err);
        }

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
        try {
            return this.db.executeSql(sql, [task.title, task.completed, task.id]);
        } catch (err) {
            return (err);
        }
    }

    borrarTabla() {
        let sql = 'DELETE FROM datosGestion';
        try {
            return this.db.executeSql(sql, []);
        } catch (err) {
            return (err);
        }
    }

    async migrarDatos(params: any) {
        await this.createTable();
        try {

            let datos: any = await this.network.get('modules/mobileApp/datosGestion', params)
            // let datos: any = await this.network.get('mobile/migrar', params)
            let cant = datos.length;
            console.log('Datos', datos)
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

    async executeQuery(query) {
        try {
            console.log('query ', query);
            let datos = await this.db.executeSql(query, []);
            let rta = [];
            if (datos && datos.rows) {
                for (let index = 0; index < datos.rows.length; index++) {
                    rta.push(datos.rows.item(index));
                }
            }
            console.log('respuesta ', rta);
            return rta;
        } catch (err) {
            return (err);
        }

    }


    async localidadesPorZona(idZona) {
        try {
            let query = 'SELECT DISTINCT IdLocalidad,Localidad FROM datosGestion where IdZona=' + idZona;
            let datos = await this.db.executeSql(query, []);
            let rta = [];
            // let rta = datos.rows.item(0);
            for (let index = 0; index < datos.rows.length; index++) {
                rta.push(datos.rows.item(index));
            }
            return rta;
        } catch (err) {
            return (err);
        }

    }

    async efectoresPorLocalidad(id) {
        try {
            let query = 'SELECT DISTINCT IdEfector, Efector FROM datosGestion where IdLocalidad=' + id;
            let datos = await this.db.executeSql(query, []);
            let rta = [];
            for (let index = 0; index < datos.rows.length; index++) {
                rta.push(datos.rows.item(index));
            }
            return rta;
        } catch (err) {
            return (err);
        }
    }

    async maxPeriodo() {
        try {
            let query = 'SELECT MAX(Periodo) as Periodo FROM datosGestion';
            let datos = await this.db.executeSql(query, []);
            // console.log('datos ', datos.rows.item(0));
            if (datos.rows.length) {
                return datos.rows.item(0).Periodo;
            } else {
                return null;
            }
        } catch (err) {
            return (err);
        }
    }

}
