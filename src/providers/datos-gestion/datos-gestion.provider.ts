import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { NetworkProvider } from '../../providers/network';
/**
 * Contiene todas las operaciones que se realizan sobre SQLite
 *
 * @export
 * DatosGestionProvider
 */
@Injectable()
export class DatosGestionProvider {
    private baseUrl = 'modules/mobileApp/problemas';
    private urlMinuta = 'modules/mobileApp/minuta';
    private db$ = new BehaviorSubject(null);

    db: SQLiteObject = null;
    constructor(
        public network: NetworkProvider,
        private platform: Platform,
        private sqlite: SQLite,
    ) {
        this.platform.ready().then(async () => {
            try {
                // await this.sqlite.selfTest();
                this.sqlite.create({
                    name: 'data.db',
                    location: 'default', // the location field is required

                }).then((db) => {
                    return this.setDatabase(db);
                }).catch(error => {
                    return ({ error });
                });
            } catch (err) {
                console.error(`Error al inicializar SQLite: "${err}".\nDebe correr la app en un emulador o dispositivo.`);
                return false;
            }
        });
    }


    setDatabase(db: SQLiteObject) {
        if (this.db === null) {
            this.db = db;
            this.db$.next(db);
        }
    }

    getDatabase() {
        return this.db$;
    }


    async insertProblemas(tupla: any, adjuntos, origen, necesitaActualizacion, objectId, idMinuta, idMinutaMongo) {
        const sql = `INSERT INTO problemas(idProblema, responsable,problema,estado, resueltoPorId, resueltoPor, plazo,fechaRegistro,origen,necesitaActualizacion,objectId, idMinutaSQL, idMinutaMongo)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        const idProblema = tupla.idProblema ? tupla.idProblema : moment().valueOf().toString();
        try {
            const row = await this.db.executeSql(sql,
                [idProblema, tupla.responsable, tupla.problema, tupla.estado.toLowerCase(), tupla.resueltoPorId, tupla.resueltoPor,
                 tupla.plazo, tupla.fechaRegistro,
                 origen, necesitaActualizacion, objectId, idMinuta, idMinutaMongo]);

            for (const adjunto of adjuntos) {
                const sqlImg = 'INSERT INTO imagenesProblema(ID_IMAGEN, BASE64, ID_PROBLEMA) VALUES (?,?,?)';
                this.db.executeSql(sqlImg, [null, adjunto, idProblema]);
            }
            const respuesta = {
                idProblema,
                responsable: tupla.responsable,
                problema: tupla.problema,
                estado: tupla.estado.toLowerCase(),
                resueltoPorId: tupla.resueltoPorId,
                resueltoPor: tupla.resueltoPor,
                plazo: tupla.plazo,
                fechaRegistro: tupla.fechaRegistro,
                origen,
                adjuntos,
                objectId,
                idMinutaSQL: idMinuta,
                idMinutaMongo
            };
            return respuesta;

        } catch (err) {
            return (err);
        }
    }

    async insertMinuta(tupla: any, origen, necesitaActualizacion, idMongo) {
        const sql = `INSERT INTO minuta(idMinuta, fecha, quienRegistra, participantes, temas, conclusiones,fechaProxima, lugarProxima, origen, necesitaActualizacion, idMongo)
        VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
        const idMinuta = tupla.idMinuta ? tupla.idMinuta : moment().valueOf().toString();
        try {
            const row =
                await this.db.executeSql(sql, [
                    idMinuta,
                    tupla.fecha,
                    tupla.quienRegistra,
                    tupla.participantes,
                    tupla.temas,
                    tupla.conclusiones,
                    tupla.fechaProxima,
                    tupla.lugarProxima,
                    origen,
                    necesitaActualizacion,
                    idMongo
                ]);
            const respuesta = {
                idMinuta,
                quienRegistra: tupla.quienRegistra,
                participantes: tupla.participantes,
                temas: tupla.temas,
                conclusiones: tupla.conclusiones,
                fechaProxima: tupla.fechaProxima,
                lugarProxima: tupla.lugarProxima,
                origen,
                idMongo,
                fecha: tupla.fecha
            };
            return respuesta;
        } catch (err) {
            return (err);
        }
    }


    insertMinutas(datos: any) {
        const insertRows = [];
        datos.forEach(tupla => {
            const idMinuta = tupla.idMinuta ? tupla.idMinuta : moment().valueOf().toString();
            insertRows.push([
                `INSERT INTO minuta(idMinuta, fecha, quienRegistra, participantes, temas, conclusiones,fechaProxima, lugarProxima, origen, necesitaActualizacion, idMongo)
        VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
                [idMinuta,
                 tupla.fecha,
                 tupla.quienRegistra,
                 tupla.participantes,
                 tupla.temas,
                 tupla.conclusiones,
                 tupla.fechaProxima,
                 tupla.lugarProxima,
                 tupla.origen,
                 0,
                 tupla.id]
            ]);
        });
        return this.db.sqlBatch(insertRows);
    }

    createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS datosGestion(idEfector INTEGER, Efector VARCHAR(200),  ' +
            'IdEfectorSuperior INTEGER, IdLocalidad INTEGER, Localidad  VARCHAR(400), IdArea INTEGER,  ' +
            'Area VARCHAR(200), IdZona integer, Zona VARCHAR(200),NivelComp VARCHAR(50), Periodo DATETIME,' +
            'Total_TH  INTEGER,TH_Oper INTEGER,TH_Tec INTEGER,TH_Prof INTEGER,TH_Asis INTEGER,' +
            'TH_Admin INTEGER, TH_Medicos INTEGER,  TH_Ped INTEGER, TH_MG INTEGER,  TH_CL INTEGER,  ' +
            'TH_Toco INTEGER,TH_Enf INTEGER, INV_GastoPer INTEGER,INV_BienesUso INTEGER, INV_BienesCons INTEGER,' +
            'INV_ServNoPers INTEGER,RED_Complejidad INTEGER, RED_Centros INTEGER, RED_PuestosSanit INTEGER,' +
            'RED_Camas INTEGER, OB_Monto INTEGER, OB_Detalle INTEGER, ' +
            'OB_Estado INTEGER, SD_Poblacion INTEGER, SD_Mujeres INTEGER, SD_Varones INTEGER, SD_Muj_15a49 INTEGER, ' +
            'SD_Menores_6 INTEGER, SD_ComOrig INTEGER,PROD_Consultas INTEGER, PROD_ConGuardia INTEGER, PROD_PorcConGuardia INTEGER, ' +
            'PROD_Egresos INTEGER, PROD_partos INTEGER,ConsMed_5anios INTEGER, ConMedGuardia_5anios INTEGER,Egre_5anios INTEGER, ' +
            'ES_Hosp INTEGER,SD_Mayores_65_anios INTEGER, TH_Conduccion INTEGER,INV_GastoPerAnioAnterio INTEGER,INV_BienesUsoAnioAnterio INTEGER,' +
            'INV_BienesConsAnioAnterio INTEGER, INV_ServNoPersAnioAnterio INTEGER, RF_Total_facturado INTEGER, RF_Total_cobrado INTEGER,RF_Total_gastado INTEGER,' +
            'RF_Total_factAnioAnterio INTEGER, RF_Total_CobradoAnioAnterio INTEGER, RF_Total_GastadoAnioAnterio INTEGER,PACES_Facturado INTEGER,PACES_Facturado_Acumulado INTEGER,' +
            'PACES_Pagado INTEGER, PACES_PagadoAcum INTEGER,PACES_Pagado_2018 INTEGER,PACES_Facturado_2018 INTEGER, Vehi_Ambulancias INTEGER,' +
            'Vehi_Otros_vehiculos INTEGER, PROD_Oc0Cama INTEGER, updated DATETIME)';
        try {
            return this.db.executeSql(sql, []);
        } catch (err) {
            return (err);
        }
    }
    createTableProf() {
        const sql = 'CREATE TABLE IF NOT EXISTS profesionales(LUGARPAGO VARCHAR(255), NRO_LIQ FLOAT, FECHA_LIQ DATETIME,' +
            'SERVICIO  VARCHAR(100), UO VARCHAR(100), LEGAJO INTEGER, SUBCONTRATO INTEGER,APENOM VARCHAR(100), ' +
            'ESPECIALIDAD VARCHAR(100), UBIGEO VARCHAR(100),' +
            'CAT_AGRUPA_CARGOS VARCHAR(100),CATEGORIA_COD VARCHAR(3), CATEGORIA_DESC VARCHAR(100),' +
            'CPN1 INTEGER, CPN2 INTEGER, CPN3 INTEGER, PROGRAMA VARCHAR (150),ESTADO_PUESTO VARCHAR(50),' +
            'CUIL VARCHAR(40),NRO_DOC VARCHAR(40),ANIO_NAC INTEGER, IdEfector INTEGER,' +
            'CANTIDAD FLOAT,  IdArea INTEGER, updated DATETIME)';
        try {
            return this.db.executeSql(sql, []);

        } catch (err) {
            return (err);
        }
    }

    createTableMortalidad() {
        const sql = 'CREATE TABLE IF NOT EXISTS mortalidad(idEfector INTEGER, Efector VARCHAR(255), Per_dd DATETIME,Per_h DATETIME,' +
            'TMAPE INTEGER, TMAPE_Zona INTEGER, TMAPE_Prov INTEGER,TMAPE_M INTEGER,TMAPE_M_Zona INTEGER,TMAPE_M_Prov INTEGER,' +
            'TMAPE_V INTEGER, TMAPE_V_Zona INTEGER,  TMAPE_V_Prov INTEGER, TMI INTEGER,  TMI_Zona INTEGER, TMI_Prov INTEGER,IdArea INTEGER, IdZona INTEGER, Periodo DATETIME,updated DATETIME)';
        try {
            return this.db.executeSql(sql, []);
        } catch (err) {
            return (err);
        }
    }

    createTableAutomotores() {
        const sql = 'CREATE TABLE IF NOT EXISTS automotores(idEfector INTEGER, Efector VARCHAR(255), tipo VARCHAR(255),Patente VARCHAR(255),' +
            'Marca VARCHAR(255), Modelo VARCHAR(255), Anio FLOAT,Estado VARCHAR(255),F9 VARCHAR(255),F10 VARCHAR(255),' +
            'F11 VARCHAR(255), F12 VARCHAR(255),  F13 VARCHAR(255), F14 VARCHAR(255),IdArea INTEGER, IdZona INTEGER, updated DATETIME)';
        try {
            return this.db.executeSql(sql, []);
        } catch (err) {
            return (err);
        }
    }

    createTableComunidades() {
        const sql = 'CREATE TABLE IF NOT EXISTS comunidadesOriginarias(idArea INTEGER, comunidad VARCHAR(255), updated DATETIME)';
        try {
            return this.db.executeSql(sql, []);
        } catch (err) {
            return (err);
        }
    }

    createTableRegistroProblemas() {
        const sql = 'CREATE TABLE IF NOT EXISTS problemas(idProblema VARCHAR(255) PRIMARY KEY, responsable , problema, estado, resueltoPorId VARCHAR(255), resueltoPor, origen, plazo, fechaRegistro DATETIME, idMinutaSQL VARCHAR(255), idMinutaMongo VARCHAR(255), necesitaActualizacion BOOLEAN,objectId VARCHAR(255)' + ')';
        try {
            return this.db.executeSql(sql, []);

        } catch (err) {
            return (err);
        }
    }

    createTableImagenesProblema() {
        const sql = 'CREATE TABLE IF NOT EXISTS imagenesProblema(ID_IMAGEN INTEGER PRIMARY KEY AUTOINCREMENT, BASE64 VARCHAR(8000), ID_PROBLEMA VARCHAR(255), FOREIGN KEY(ID_PROBLEMA) REFERENCES problemas(idProblema) ' + ')';
        try {
            return this.db.executeSql(sql, []);

        } catch (err) {
            return (err);
        }
    }

    createTableMinuta() {
        const sql = 'CREATE TABLE IF NOT EXISTS minuta(idMinuta VARCHAR(255) PRIMARY KEY,fecha DATETIME, quienRegistra, participantes ,temas,conclusiones,pendientes VARCHAR(255),fechaProxima DATETIME,lugarProxima VARCHAR(255),origen, necesitaActualizacion BOOLEAN,idMongo VARCHAR(255) )';
        try {
            return this.db.executeSql(sql, []);

        } catch (err) {
            return (err);
        }
    }


    insertMultiple(datos: any) {
        const insertRows = [];
        const updated = moment().format('YYYY-MM-DD HH:mm');
        datos.forEach(tupla => {
            insertRows.push([
                `INSERT INTO datosGestion(idEfector, Efector, IdEfectorSuperior, IdLocalidad, Localidad, IdArea, Area, IdZona, Zona,
                    NivelComp, Periodo,Total_TH,TH_Oper,TH_Tec,TH_Prof,TH_Asis,TH_Admin, TH_Medicos,TH_Ped,TH_MG,TH_CL,TH_Toco, TH_Enf,
                    INV_GastoPer,INV_BienesUso, INV_BienesCons, INV_ServNoPers, RED_Complejidad, RED_Centros, RED_PuestosSanit,
                RED_Camas, OB_Monto, OB_Detalle,OB_Estado, SD_Poblacion, SD_Mujeres, SD_Varones, SD_Muj_15a49, SD_Menores_6,
                PROD_Consultas, PROD_ConGuardia, PROD_PorcConGuardia, PROD_Egresos, ConsMed_5anios, ConMedGuardia_5anios,Egre_5anios,
                ES_Hosp,SD_Mayores_65_anios,TH_Conduccion,INV_GastoPerAnioAnterio,INV_BienesUsoAnioAnterio, INV_BienesConsAnioAnterio,INV_ServNoPersAnioAnterio,
                RF_Total_facturado,RF_Total_cobrado,RF_Total_gastado, RF_Total_factAnioAnterio,RF_Total_CobradoAnioAnterio,RF_Total_GastadoAnioAnterio,PACES_Facturado,PACES_Facturado_Acumulado,
                PACES_Pagado, PACES_PagadoAcum,PACES_Pagado_2018, PACES_Facturado_2018,Vehi_Ambulancias,Vehi_Otros_vehiculos, SD_ComOrig, PROD_partos, PROD_Oc0Cama, updated)
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
                       ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
                       ?,?,?,?,?,?,?,?,?,?,?)`,
                [tupla.idEfector, tupla.Efector, tupla.IdEfectorSuperior, tupla.IdLocalidad,
                 tupla.Localidad, tupla.IdArea, tupla.Area, tupla.IdZona, tupla.Zona,
                 tupla.NivelComp, tupla.Periodo, tupla.Total_TH, tupla.TH_Oper, tupla.TH_Tec,
                 tupla.TH_Prof, tupla.TH_Asis, tupla.TH_Admin, tupla.TH_Medicos, tupla.TH_Ped,
                 tupla.TH_MG, tupla.TH_CL, tupla.TH_Toco, tupla.TH_Enf,
                 tupla.INV_GastoPer, tupla.INV_BienesUso, tupla.INV_BienesCons, tupla.INV_ServNoPers,
                 tupla.RED_Complejidad, tupla.RED_Centros, tupla.RED_PuestosSanit,
                 tupla.RED_Camas, tupla.OB_Monto, tupla.OB_Detalle, tupla.OB_Estado, tupla.SD_Poblacion, tupla.SD_Mujeres,
                 tupla.SD_Varones, tupla.SD_Muj_15a49, tupla.SD_Menores_6, tupla.PROD_Consultas, tupla.PROD_ConGuardia,
                 tupla.PROD_PorcConGuardia, tupla.PROD_Egresos, tupla.ConsMed_5años, tupla.ConMedGuardia_5años, tupla.Egre_5años,
                 tupla.ES_Hosp, tupla.SD_Mayores_65_años, tupla.TH_Conducción, tupla.INV_GastoPerAnioAnterio, tupla.INV_BienesUsoAnioAnterio,
                 tupla.INV_BienesConsAnioAnterio, tupla.INV_ServNoPersAnioAnterio, tupla.RF_Total_facturado,
                 tupla.RF_Total_cobrado, tupla.RF_Total_gastado,
                 tupla.RF_Total_factAnioAnterio, tupla.RF_Total_CobradoAnioAnterio, tupla.RF_Total_GastadoAnioAnterio,
                 tupla.PACES_Facturado, tupla.PACES_Facturado_Acumulado,
                 tupla.PACES_Pagado, tupla.PACES_PagadoAcum, tupla.PACES_Pagado_2018, tupla.PACES_Facturado_2018, tupla.Vehi_Ambulancias,
                 tupla.Vehi_Otros_vehiculos, tupla.SD_ComOrig, tupla.PROD_partos, tupla.PROD_Oc0Cama, updated]
            ]);
        });
        return this.db.sqlBatch(insertRows);
    }

    insertMultipleProf(datosProf: any) {
        const insertRows = [];
        const updated = moment().format('YYYY-MM-DD HH:mm');
        datosProf.forEach(tupla => {
            insertRows.push([
                `INSERT INTO profesionales(LUGARPAGO, NRO_LIQ, FECHA_LIQ, SERVICIO, UO, LEGAJO,
                    SUBCONTRATO,
                    APENOM, ESPECIALIDAD,
                    UBIGEO, CAT_AGRUPA_CARGOS,
                    CATEGORIA_COD,CATEGORIA_DESC,CPN1,CPN2,CPN3,PROGRAMA,
                    ESTADO_PUESTO, CUIL,NRO_DOC, ANIO_NAC,CANTIDAD, IdEfector,IdArea,updated)
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [tupla.LUGARPAGO, tupla.NRO_LIQ, tupla.FECHA_LIQ,
                 tupla.SERVICIO, tupla.UO, tupla.LEGAJO,
                 tupla.SUBCONTRATO, tupla.APENOM, tupla.ESPECIALIDAD, tupla.UBIGEO, tupla.CAT_AGRUPA_CARGOS,
                 tupla.CATEGORIA_COD, tupla.CATEGORIA_DESC, tupla.CPN1, tupla.CPN2, tupla.CPN3, tupla.PROGRAMA,
                 tupla.ESTADO_PUESTO, tupla.CUIL, tupla.NRO_DOC, tupla.ANIO_NAC,
                 tupla.CANTIDAD, tupla.IdEfector, tupla.IdArea, updated]
            ]);
        });
        return this.db.sqlBatch(insertRows);
    }

    eliminarEspaciosEspecialidades() {
        const sql = 'UPDATE profesionales SET ESPECIALIDAD=trim(ESPECIALIDAD), CATEGORIA_DESC=trim(CATEGORIA_DESC)';
        try {
            return this.db.executeSql(sql, []);
        } catch (err) {
            return (err);
        }
    }

    insertMultipleMortalidad(datosMort: any) {
        const insertRows = [];
        const updated = moment().format('YYYY-MM-DD HH:mm');

        datosMort.forEach(tupla => {
            insertRows.push([
                `INSERT INTO mortalidad(idEfector, Efector, Per_dd, Per_h, TMAPE,
                    TMAPE_Zona,
                    TMAPE_Prov, TMAPE_M,
                    TMAPE_M_Zona, TMAPE_M_Prov,
                    TMAPE_V,TMAPE_V_Zona,TMAPE_V_Prov,TMI,TMI_Zona,TMI_Prov,IdArea,IdZona,Periodo,
                    updated)
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [tupla.Id, tupla.Efector, tupla.Per_dd,
                 tupla.Per_h, tupla.TMAPE, tupla.TMAPE_Zona,
                 tupla.TMAPE_Prov, tupla.TMAPE_M, tupla.TMAPE_M_Zona, tupla.TMAPE_M_Prov, tupla.TMAPE_V,
                 tupla.TMAPE_V_Zona, tupla.TMAPE_V_Prov, tupla.TMI, tupla.TMI_Zona,
                 tupla.TMI_Prov, tupla.IdArea, tupla.IdZona, tupla.Per_dd, updated]
            ]);
        });
        return this.db.sqlBatch(insertRows);
    }

    insertMultipleAutomotores(datosAut: any) {
        const insertRows = [];
        const updated = moment().format('YYYY-MM-DD HH:mm');

        datosAut.forEach(tupla => {
            insertRows.push([
                `INSERT INTO automotores(idEfector, Efector, tipo, Patente, Marca,
                    Modelo,
                    Anio, Estado,
                    F9,F10,F11,F12,
                    F13,F14,IdArea,IdZona,
                    updated)
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [tupla.idEfector, tupla.Efector, tupla.tipo,
                 tupla.Patente, tupla.Marca, tupla.Modelo,
                 tupla.Año, tupla.Estado, tupla.F9, tupla.F10, tupla.F11,
                 tupla.F12, tupla.F13, tupla.F14, tupla.IdArea, tupla.IdZona, updated]
            ]);
        });
        return this.db.sqlBatch(insertRows);
    }

    insertMultipleCO(datosCO: any) {
        const insertRows = [];
        const updated = moment().format('YYYY-MM-DD HH:mm');

        datosCO.forEach(tupla => {
            insertRows.push([
                `INSERT INTO comunidadesOriginarias(idArea, comunidad, updated)
                VALUES(?,?,?)`,
                [tupla.AreaPrograma, tupla.Comunidad, updated]
            ]);
        });
        return this.db.sqlBatch(insertRows);
    }

    delete() {
        const sql = 'DELETE FROM datosGestion';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }

    }
    deleteProf() {
        const sql = 'DELETE FROM profesionales';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }

    }
    deleteMort() {
        const sql = 'DELETE FROM mortalidad';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }
    }
    deleteAut() {
        const sql = 'DELETE FROM automotores';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }
    }

    deleteCO() {
        const sql = 'DELETE FROM comunidadesOriginarias';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }
    }

    limpiar() {
        const sql = 'DELETE FROM problemas';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }

    }

    limpiarImagenes() {
        const sql = 'DELETE FROM imagenesProblema';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }

    }

    deleteMinutas() {
        const sql = 'DELETE FROM minuta';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }

    }

    obtenerDatos() {
        const sql = 'SELECT * FROM datosGestion';
        return this.db.executeSql(sql, [])
            .then(response => {
                const datos = [];
                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return Promise.resolve(datos);
            })
            .catch(error => console.error(error));
    }
    obtenerDatosProf() {
        const sql = 'SELECT * FROM profesionales';
        return this.db.executeSql(sql, [])
            .then(response => {
                const datos = [];

                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return Promise.resolve(datos);
            })
            .catch(error => error);
    }

    obtenerUnProf(documento) {
        const sql = 'SELECT * FROM profesionales where NRO_DOC = "' + documento + '"';
        return this.db.executeSql(sql, [])
            .then(response => {
                const datos = [];

                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return Promise.resolve(datos);
            })
            .catch(error => error);
    }

    obtenerDatosMortalidad() {
        const sql = 'SELECT * FROM mortalidad';

        return this.db.executeSql(sql, [])
            .then(response => {
                const datos = [];

                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return Promise.resolve(datos);
            })
            .catch(error => error);
    }
    obtenerDatosAutomotores() {
        const sql = 'SELECT * FROM automotores';

        return this.db.executeSql(sql, [])
            .then(response => {
                const datos = [];

                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return Promise.resolve(datos);
            })
            .catch(error => error);
    }


    obtenerMinutas() {
        const sql = 'SELECT * FROM minuta M LEFT JOIN (Select DISTINCT idEfector, Efector, IdEfectorSuperior, IdArea, Area, IdZona, Zona ' +
            ' FROM datosGestion) AUX ON M.origen = AUX.Efector ORDER BY M.fecha DESC';
        return this.db.executeSql(sql, [])
            .then(response => {
                const datos = [];
                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return Promise.resolve(datos);
            })
            .catch(error => error);
    }

    obtenerMinuta(id) {
        const sql = 'SELECT fecha, quienRegistra,participantes, temas,conclusiones,fechaProxima,lugarProxima,origen FROM minuta WHERE idMinuta = "' + id + '"';
        try {
            return this.db.executeSql(sql, []).then(response => {
                return Promise.resolve(response.rows.item(0));
            });

        } catch (err) {
            return (err);
        }
    }
    obtenerListadoProblemas() {
        const sql = 'SELECT problemas.*, minuta.idMongo as idMongo, AUX.* FROM problemas INNER JOIN minuta ON problemas.idMinutaSQL = minuta.idMinuta ' +
            ' LEFT JOIN (Select DISTINCT idEfector, Efector, IdEfectorSuperior, IdArea, Area, IdZona, Zona FROM datosGestion) AUX ON problemas.origen = AUX.Efector' +
            ' ORDER BY problemas.fechaRegistro DESC';
        return this.db.executeSql(sql, [])
            .then(response => {
                const datos = [];

                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return Promise.resolve(datos);
            })
            .catch(error => error);
    }

    obtenerImagenes() {
        const sql = 'SELECT * FROM imagenesProblema';
        return this.db.executeSql(sql, [])
            .then(response => {
                const datos = [];

                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return Promise.resolve(datos);
            })
            .catch(error => error);
    }

    obtenerImagenesProblemasPorId(id) {
        const sql = 'SELECT * FROM imagenesProblema where  ID_PROBLEMA = "' + id + '"';
        return this.db.executeSql(sql, [])
            .then(response => {
                const datos = [];

                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return Promise.resolve(datos);
            })
            .catch(error => error);
    }


    update(task: any) {
        const sql = 'UPDATE datosGestion SET title=?, completed=? WHERE id=?';
        try {
            return this.db.executeSql(sql, [task.title, task.completed, task.id]);
        } catch (err) {
            return (err);
        }
    }

    updateEstadoProblema(task: any, user: any, cargo: string) {
        try {
            let sql;
            if (task.estado === 'resuelto') {
                sql = 'UPDATE problemas SET estado=?, necesitaActualizacion=?, resueltoPorId=?, resueltoPor=? WHERE idProblema=?';
                return this.db.executeSql(sql, [task.estado, 1, user._id, cargo, task.idProblema]);
            } else {
                sql = 'UPDATE problemas SET estado=?, necesitaActualizacion=? WHERE idProblema=?';
                return this.db.executeSql(sql, [task.estado, 1, task.idProblema]);
            }
        } catch (err) {
            return (err);
        }
    }

    updateEstadoActualizacion(task, objectId) {
        const sql = 'UPDATE problemas SET necesitaActualizacion=?, objectId=? WHERE idProblema=?';
        try {
            return this.db.executeSql(sql, [0, objectId, task.idProblema]);
        } catch (err) {
            return (err);
        }
    }

    updateMinutaProblema(idMinutaSQL, idMinutaMongo, idProblema) {
        const sql = 'UPDATE problemas SET idMinutaSQL=?, idMinutaMongo=? WHERE idProblema=?';
        try {
            return this.db.executeSql(sql, [idMinutaSQL, idMinutaMongo, idProblema]);
        } catch (err) {
            return (err);
        }
    }

    updateActualizacionMinuta(task, objectId) {

        const sql = 'UPDATE minuta SET necesitaActualizacion=?, idMongo=? WHERE idMinuta=?';
        try {
            return this.db.executeSql(sql, [0, objectId, task.idMinuta]);
        } catch (err) {
            return (err);
        }
    }
    updateMinuta(idMinuta, minuta, origen) {
        const sql = 'UPDATE minuta SET fecha=?, quienRegistra=?,participantes=?,temas=?,conclusiones=?,fechaProxima=?,lugarProxima=?,origen=?,  necesitaActualizacion=?  WHERE idMinuta=?';
        try {
            return this.db.executeSql(sql, [minuta.fecha, minuta.quienRegistra, minuta.participantes, minuta.temas,
                                            minuta.conclusiones, minuta.fechaProxima, minuta.lugarProxima, origen, 1, idMinuta]);
        } catch (err) {
            return (err);
        }
    }


    async migrarDatos(params: any) {
        let migro = false;
        let migroProf = false;
        let migroMort = false;
        let migroAut = false;
        try {
            const datos: any = await this.network.get('modules/mobileApp/datosGestion', params);
            // let datos: any = await this.network.get('mobile/migrar', params)
            // let datos: any = await this.network.getMobileApi('mobile/migrar', params)
            if (datos) {
                const cant = datos.lista ? datos.lista.length : 0;
                if (cant > 0) {
                    await this.delete();
                    await this.insertMultiple(datos.lista);
                    migro = true;
                }
                const cantProf = datos.listaProf ? datos.listaProf.length : 0;
                if (cantProf > 0) {
                    await this.deleteProf();
                    await this.insertMultipleProf(datos.listaProf);
                    await this.eliminarEspaciosEspecialidades();
                    migroProf = true;

                }
                const cantMort = datos.listaMort ? datos.listaMort.length : 0;
                if (cantMort > 0) {
                    await this.deleteMort();
                    await this.insertMultipleMortalidad(datos.listaMort);
                    migroMort = true;

                }
                const cantAut = datos.listaAut ? datos.listaAut.length : 0;
                if (cantAut > 0) {
                    await this.deleteAut();
                    await this.insertMultipleAutomotores(datos.listaAut);
                    migroAut = true;
                }
                const cantCO = datos.listaCO ? datos.listaCO.length : 0;
                if (cantCO > 0) {
                    await this.deleteCO();
                    await this.insertMultipleCO(datos.listaCO);
                    migroAut = true;
                }

                // No se estan migrando la lista de automotores del micro if (migro && migroProf && migroMort && migroAut) {
                if (migro) {
                    await this.sqlToMongoMinutas();
                    await this.mongoToSqlMinutas();
                    await this.sqlToMongoProblemas();
                    await this.mongoToSqlProblemas();
                    return true;
                } else {
                    return false;
                }
            } else { return false; }
        } catch (error) {
            return (error);
        }
    }


    eliminarTablaMinutas() {
        const sql = 'DROP TABLE IF EXISTS minuta';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }
    }


    async executeQuery(query) {
        try {
            const datos = await this.db.executeSql(query, []);
            const rta = [];
            if (datos && datos.rows) {
                for (let index = 0; index < datos.rows.length; index++) {
                    rta.push(datos.rows.item(index));
                }
            }
            return rta;
        } catch (err) {
            return (err);
        }

    }



    async areasPorZona(idZona) {
        try {
            const db = this.getDatabase();
            const query = 'SELECT DISTINCT IdArea,Area FROM datosGestion where IdZona=' + idZona;
            const datos = await this.db.executeSql(query, []);
            const rta = [];
            for (let index = 0; index < datos.rows.length; index++) {
                rta.push(datos.rows.item(index));
            }
            return rta;
        } catch (err) {
            return (err);
        }

    }

    async efectoresPorZona(id) {
        try {
            const db = this.getDatabase();
            const query = 'SELECT DISTINCT idEfector, Efector, idEfectorSuperior, ES_Hosp FROM datosGestion where IdArea=' + id;
            const datos = await this.db.executeSql(query, []);
            const rta = [];
            for (let index = 0; index < datos.rows.length; index++) {
                rta.push(datos.rows.item(index));
            }
            return rta;
        } catch (err) {
            return (err);
        }
    }

    async efectorPorId(id) {
        try {
            const query = 'SELECT * FROM datosGestion where idEfector=' + id + ' LIMIT 1';
            const datos = await this.db.executeSql(query, []);
            const rta = [];
            for (let index = 0; index < datos.rows.length; index++) {
                rta.push(datos.rows.item(index));
            }
            return rta;
        } catch (err) {
            return (err);
        }
    }

    // Actualiza la DB de mongo con los reportes nuevos o modificados (necesitaActualizacion === 1)

    maxPeriodo() {
        this.getDatabase().subscribe(async (db) => {
            try {
                const query = 'SELECT Periodo FROM datosGestion ORDER BY Periodo DESC LIMIT 1;';
                const datos = await db.executeSql(query, []);
                if (datos.rows.length > 0) {
                    return datos.rows.item(0).Periodo;
                } else {
                    return null;
                }
            } catch (err) {
                return (err);
            }
        });
    }

    desdePeriodoMortalidad() {
        this.getDatabase().subscribe(async (db: SQLiteObject) => {
            try {
                const query = 'SELECT Per_dd FROM mortalidad ORDER BY Per_dd DESC LIMIT 1;';
                const datos = await db.executeSql(query, []);
                if (datos.rows.length) {
                    return datos.rows.item(0).Per_dd;
                } else {
                    return null;
                }
            } catch (err) {
                return (err);
            }
        });
    }

    hastaPeriodoMortalidad() {
        this.getDatabase().subscribe(async (db: SQLiteObject) => {
            try {
                const query = 'SELECT Per_h FROM mortalidad ORDER BY Per_h DESC LIMIT 1;';
                const datos = await db.executeSql(query, []);
                if (datos.rows.length) {
                    return datos.rows.item(0).Per_h;
                } else {
                    return null;
                }
            } catch (err) {
                return (err);
            }

        });
    }

    async sqlToMongoProblemas() {
        try {
            const listadoProblemas = await this.obtenerListadoProblemas();
            let listadoImg = await this.obtenerImagenes();
            const resultadoBusqueda = listadoProblemas.filter(item => item.necesitaActualizacion === 1);
            listadoImg = listadoImg.filter(img => resultadoBusqueda.some(prob => prob.idProblema === img.ID_PROBLEMA));

            for (const resultado of resultadoBusqueda) {
                let adjuntosAux;
                resultado.estado = resultado.estado.toLowerCase();
                adjuntosAux = listadoImg.filter(item => resultado.idProblema === item.ID_PROBLEMA);
                adjuntosAux = adjuntosAux.map(adj => adj.BASE64);
                const element: any = {
                    idProblema: resultado.idProblema,
                    // quienRegistra: resultado.quienRegistra,
                    responsable: resultado.responsable,
                    problema: resultado.problema,
                    estado: resultado.estado,
                    origen: resultado.origen,
                    plazo: resultado.plazo,
                    referenciaInforme: resultado.referenciaInforme,
                    fechaRegistro: resultado.fechaRegistro,
                    adjuntos: adjuntosAux,
                    idMinutaSQL: resultado.idMinutaSQL,
                    idMinutaMongo: resultado.idMongo,
                    resueltoPor: resultado.resueltoPor,
                    resueltoPorId: resultado.resueltoPorId
                };
                if (!resultado.objectId) {
                    await this.postMongoProblemas(element);
                } else {
                    element.objectId = resultado.objectId;
                    await this.patchMongoProblemas(element);
                }
                // inserta en mongo

                // await this.updateEstadoActualizacion(element);
            }
        } catch (err) {
            return (err);
        }
    }


    async mongoToSqlProblemas() {
        try {
            const listado: any = await this.getMongoProblemas();
            if (listado) {
                await this.limpiar();
                await this.limpiarImagenes();
            }
            for (const item of listado) {

                // inserta en dispositivo local
                this.insertProblemas(item, item.adjuntos, item.origen, 0, item.id, item.idMinutaSQL, item.idMinutaMongo);
            }
        } catch (err) {
            return (err);
        }
    }

    async sqlToMongoMinutas() {
        try {
            const listadoMinutas = await this.obtenerMinutas();
            const resultadoBusqueda = listadoMinutas.filter(item => item.necesitaActualizacion === 1);

            for (const resultado of resultadoBusqueda) {

                const element = {
                    idMinuta: resultado.idMinuta,
                    quienRegistra: resultado.quienRegistra,
                    participantes: resultado.participantes,
                    temas: resultado.temas,
                    conclusiones: resultado.conclusiones,
                    fechaProxima: resultado.fechaProxima,
                    lugarProxima: resultado.lugarProxima,
                    origen: resultado.origen,
                    fecha: resultado.fecha,
                };
                if (!resultado.idMongo) {
                    const minutaRegistrada: any = await this.postMongoMinuta(element);
                    // Seteamos como actualizado el registro
                    this.updateActualizacionMinuta(element, minutaRegistrada._id);
                } else {
                    await this.patchMongoMinuta(element, resultado.idMongo);
                }
            }
        } catch (err) {
            return (err);
        }
    }


    async mongoToSqlMinutas() {
        try {
            const listado: any = await this.getMongoMinuta();
            if (listado) {
                await this.eliminarTablaMinutas();
                await this.createTableMinuta();
                await this.insertMinutas(listado);
            }
        } catch (err) {
            return (err);
        }
    }


    getMongoProblemas() {
        return this.network.get(this.baseUrl, {});

    }
    getMongoMinuta() {
        return this.network.get(this.urlMinuta, {});

    }

    postMongoProblemas(body) {
        return this.network.post(this.baseUrl, body);
    }
    postMongoMinuta(body) {
        return this.network.post(this.urlMinuta, body);
    }

    patchMongoProblemas(problema) {
        return this.network.patch(this.baseUrl + '/' + problema.objectId, problema);
    }
    patchMongoMinuta(minuta, idMinuta) {
        return this.network.patch(this.urlMinuta + '/' + idMinuta, minuta);
    }

    async problemasMinuta(idMinutaSQL) {
        try {
            const query = 'SELECT * from problemas where idMinutaSQL=' + idMinutaSQL;
            const datos = await this.db.executeSql(query, []);
            const rta = [];
            for (let index = 0; index < datos.rows.length; index++) {
                rta.push(datos.rows.item(index));
            }
            return rta;
        } catch (err) {
            return (err);
        }
    }

    async minutaDeProblemas(idMinutaSQL) {
        try {
            const query = 'SELECT * from minuta where idMinuta=' + idMinutaSQL;
            const datos = await this.db.executeSql(query, []);
            if (datos) {
                return datos.rows.item(0);
            }

        } catch (err) {
            return (err);
        }
    }

    async crearTablasSqlite() {
        await Promise.all([
            this.createTable(),
            this.createTableProf(),
            this.createTableMortalidad(),
            this.createTableAutomotores(),
            this.createTableMinuta(),
            this.createTableRegistroProblemas(),
            this.createTableImagenesProblema()]);
    }

    async deleteTable(table) {
        const sql = 'DROP TABLE IF EXISTS ' + table;
        try {
            await this.db.executeSql(sql, []);
            await this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }
    }

    async deleteTablasSqLite() {
        const query = 'SELECT name FROM sqlite_master WHERE type=\'table\' ORDER BY name';
        const datos = await this.db.executeSql(query, []);
        for (let index = 0; index < datos.rows.length; index++) {
            await this.deleteTable(datos.rows.item(index).name);
        }

    }
}
