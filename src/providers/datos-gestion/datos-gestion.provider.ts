import { Injectable, ɵConsole } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import * as moment from 'moment';
import { NetworkProvider } from '../../providers/network';
import { RupConsultorioPage } from 'pages/profesional/consultorio/rup-consultorio';

@Injectable()
export class DatosGestionProvider {
    private baseUrl = 'modules/mobileApp/problemas';
    private urlMinuta = 'modules/mobileApp/minuta';

    db: SQLiteObject = null;

    constructor(public network: NetworkProvider) { }


    setDatabase(db: SQLiteObject) {
        if (this.db === null) {
            this.db = db;
        }
    }


    async insertProblemas(tupla: any, adjuntos, origen, necesitaActualizacion, objectId, idMinuta, idMinutaMongo) {
        let sql = `INSERT INTO problemas(idProblema, responsable,problema,estado,plazo,fechaRegistro,origen,necesitaActualizacion,objectId, idMinutaSQL, idMinutaMongo)
        VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
        let idProblema = tupla.idProblema ? tupla.idProblema : moment().valueOf().toString();
        try {
            let row = await this.db.executeSql(sql, [idProblema, tupla.responsable, tupla.problema, tupla.estado.toLowerCase(), tupla.plazo, tupla.fechaRegistro,
                origen, necesitaActualizacion, objectId, idMinuta, idMinutaMongo]);
            for (let index = 0; index < adjuntos.length; index++) {
                const element = adjuntos[index];
                let sqlImg = `INSERT INTO imagenesProblema(ID_IMAGEN, BASE64, ID_PROBLEMA) VALUES (?,?,?)`;
                this.db.executeSql(sqlImg, [null, element, idProblema])
            }
            let respuesta = {
                idProblema: idProblema,
                responsable: tupla.responsable,
                problema: tupla.problema,
                estado: tupla.estado.toLowerCase(),
                plazo: tupla.plazo,
                fechaRegistro: tupla.fechaRegistro,
                origen: origen,
                adjuntos: adjuntos,
                objectId: objectId,
                idMinutaSQL: idMinuta,
                idMinutaMongo: idMinutaMongo


            }
            return respuesta;

        } catch (err) {
            return (err);
        }
    }

    async insertMinuta(tupla: any, origen, necesitaActualizacion, idMongo) {
        let sql = `INSERT INTO minuta(idMinuta, fecha, quienRegistra, participantes, temas, conclusiones,pendientes,fechaProxima, lugarProxima, origen, necesitaActualizacion, idMongo)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;
        let idMinuta = tupla.idMinuta ? tupla.idMinuta : moment().valueOf().toString();
        try {
            let row = await this.db.executeSql(sql, [idMinuta, tupla.fecha, tupla.quienRegistra, tupla.participantes, tupla.temas, tupla.conclusiones, tupla.pendientes, tupla.fechaProxima, tupla.lugarProxima, origen, necesitaActualizacion, idMongo]);
            let respuesta = {
                idMinuta: idMinuta,
                quienRegistra: tupla.quienRegistra,
                participantes: tupla.participantes,
                temas: tupla.temas,
                conclusiones: tupla.conclusiones,
                pendientes: tupla.pendientes,
                fechaProxima: tupla.fechaProxima,
                lugarProxima: tupla.lugarProxima,
                origen: origen,
                idMongo: idMongo,
                fecha: tupla.fecha
            }
            return respuesta;
        } catch (err) {
            return (err);
        }
    }

    createTable() {
        let sql = 'CREATE TABLE IF NOT EXISTS datosGestion(idEfector INTEGER, Efector VARCHAR(200),  ' +
            'IdEfectorSuperior INTEGER, IdLocalidad INTEGER, Localidad  VARCHAR(400), IdArea INTEGER,  ' +
            'Area VARCHAR(200), IdZona integer, Zona VARCHAR(200),NivelComp VARCHAR(50), Periodo DATE,' +
            'Total_TH  INTEGER,TH_Oper INTEGER,TH_Tec INTEGER,TH_Prof INTEGER,TH_Asis INTEGER,' +
            'TH_Admin INTEGER, TH_Medicos INTEGER,  TH_Ped INTEGER, TH_MG INTEGER,  TH_CL INTEGER,  ' +
            'TH_Toco INTEGER,TH_Enf INTEGER, INV_GastoPer INTEGER,INV_BienesUso INTEGER, INV_BienesCons INTEGER,' +
            'INV_ServNoPers INTEGER,RED_Complejidad INTEGER, RED_Centros INTEGER, RED_PuestosSanit INTEGER,' +
            'RED_Camas INTEGER, OB_Monto INTEGER, OB_Detalle INTEGER, ' +
            'OB_Estado INTEGER, SD_Poblacion INTEGER, SD_Mujeres INTEGER, SD_Varones INTEGER, SD_Muj_15a49 INTEGER, ' +
            'SD_Menores_6 INTEGER,PROD_Consultas INTEGER, PROD_ConGuardia INTEGER, PROD_PorcConGuardia INTEGER, ' +
            'PROD_Egresos INTEGER, ConsMed_5anios INTEGER, ConMedGuardia_5anios INTEGER,Egre_5anios INTEGER, ' +
            'ES_Hosp INTEGER,SD_Mayores_65_anios INTEGER, TH_Conduccion INTEGER,INV_GastoPer2018 INTEGER,INV_BienesUso2018 INTEGER,' +
            'INV_BienesCons2018 INTEGER, INV_ServNoPers2018 INTEGER, RF_Total_facturado INTEGER, RF_Total_cobrado INTEGER,' +
            'RF_Total_fact2018 INTEGER, RF_Total_Cobrado2018 INTEGER,PACES_Facturado INTEGER,PACES_Facturado_Acumulado INTEGER,' +
            'PACES_Pagado INTEGER, PACES_PagadoAcum INTEGER,PACES_Pagado_2018 INTEGER,PACES_Facturado_2018 INTEGER, Vehi_Ambulancias INTEGER,' +
            'Vehi_Otros_vehiculos INTEGER, updated DATETIME)';
        try {
            return this.db.executeSql(sql, []);
        } catch (err) {
            return (err);
        }
    }
    createTableProf() {
        let sql = 'CREATE TABLE IF NOT EXISTS profesionales(LUGARPAGO VARCHAR(255), NRO_LIQ FLOAT, FECHA_LIQ DATE,' +
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
        let sql = 'CREATE TABLE IF NOT EXISTS mortalidad(idEfector INTEGER, Efector VARCHAR(255), Per_dd DATE,Per_h DATE,' +
            'TMAPE INTEGER, TMAPE_Zona INTEGER, TMAPE_Prov INTEGER,TMAPE_M INTEGER,TMAPE_M_Zona INTEGER,TMAPE_M_Prov INTEGER,' +
            'TMAPE_V INTEGER, TMAPE_V_Zona INTEGER,  TMAPE_V_Prov INTEGER, TMI INTEGER,  TMI_Zona INTEGER, TMI_Prov INTEGER,IdArea INTEGER, IdZona INTEGER, Periodo DATETIME,updated DATETIME)';
        try {
            return this.db.executeSql(sql, []);
        } catch (err) {
            return (err);
        }
    }

    createTableAutomotores() {
        let sql = 'CREATE TABLE IF NOT EXISTS automotores(idEfector INTEGER, Efector VARCHAR(255), tipo VARCHAR(255),Patente VARCHAR(255),' +
            'Marca VARCHAR(255), Modelo VARCHAR(255), Anio FLOAT,Estado VARCHAR(255),F9 VARCHAR(255),F10 VARCHAR(255),' +
            'F11 VARCHAR(255), F12 VARCHAR(255),  F13 VARCHAR(255), F14 VARCHAR(255),IdArea INTEGER, IdZona INTEGER, updated DATETIME)';
        try {
            return this.db.executeSql(sql, []);
        } catch (err) {
            return (err);
        }
    }


    createTableRegistroProblemas() {
        let sql = 'CREATE TABLE IF NOT EXISTS problemas(idProblema VARCHAR(255) PRIMARY KEY, responsable ,problema,estado,origen, plazo, fechaRegistro DATETIME,idMinutaSQL VARCHAR(255), idMinutaMongo VARCHAR(255), necesitaActualizacion BOOLEAN,objectId VARCHAR(255)' + ')';
        try {
            return this.db.executeSql(sql, []);

        } catch (err) {
            return (err);
        }
    }

    createTableImagenesProblema() {
        let sql = 'CREATE TABLE IF NOT EXISTS imagenesProblema(ID_IMAGEN INTEGER PRIMARY KEY AUTOINCREMENT, BASE64 VARCHAR(8000), ID_PROBLEMA VARCHAR(255), FOREIGN KEY(ID_PROBLEMA) REFERENCES problemas(idProblema) ' + ')';
        try {
            return this.db.executeSql(sql, []);

        } catch (err) {
            return (err);
        }
    }

    createTableMinuta() {
        let sql = 'CREATE TABLE IF NOT EXISTS minuta(idMinuta VARCHAR(255) PRIMARY KEY,fecha DATE, quienRegistra, participantes ,temas,conclusiones,pendientes VARCHAR(255),fechaProxima DATE,lugarProxima VARCHAR(255),origen, necesitaActualizacion BOOLEAN,idMongo VARCHAR(255) )';
        try {
            return this.db.executeSql(sql, []);

        } catch (err) {
            return (err);
        }
    }


    insertMultiple(datos: any) {
        let insertRows = [];
        let updated = moment().format('YYYY-MM-DD HH:mm');
        datos.forEach(tupla => {
            insertRows.push([
                `INSERT INTO datosGestion(idEfector, Efector, IdEfectorSuperior, IdLocalidad, Localidad, IdArea, Area, IdZona, Zona,
                    NivelComp, Periodo,Total_TH,TH_Oper,TH_Tec,TH_Prof,TH_Asis,TH_Admin, TH_Medicos,TH_Ped,TH_MG,TH_CL,TH_Toco, TH_Enf,
                    INV_GastoPer,INV_BienesUso, INV_BienesCons, INV_ServNoPers, RED_Complejidad, RED_Centros, RED_PuestosSanit,
                RED_Camas, OB_Monto, OB_Detalle,OB_Estado, SD_Poblacion, SD_Mujeres, SD_Varones, SD_Muj_15a49, SD_Menores_6,
                PROD_Consultas, PROD_ConGuardia, PROD_PorcConGuardia, PROD_Egresos, ConsMed_5anios, ConMedGuardia_5anios,Egre_5anios,
                ES_Hosp,SD_Mayores_65_anios,TH_Conduccion,INV_GastoPer2018,INV_BienesUso2018, INV_BienesCons2018,INV_ServNoPers2018,
                RF_Total_facturado,RF_Total_cobrado, RF_Total_fact2018,RF_Total_Cobrado2018,PACES_Facturado,PACES_Facturado_Acumulado,
                PACES_Pagado, PACES_PagadoAcum,PACES_Pagado_2018, PACES_Facturado_2018,Vehi_Ambulancias,Vehi_Otros_vehiculos, updated)
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
                       ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
                       ?,?,?,?,?,?)`,
                [tupla.idEfector, tupla.Efector, tupla.IdEfectorSuperior, tupla.IdLocalidad, tupla.Localidad, tupla.IdArea, tupla.Area, tupla.IdZona, tupla.Zona,
                tupla.NivelComp, tupla.Periodo, tupla.Total_TH, tupla.TH_Oper, tupla.TH_Tec, tupla.TH_Prof, tupla.TH_Asis, tupla.TH_Admin, tupla.TH_Medicos, tupla.TH_Ped, tupla.TH_MG, tupla.TH_CL, tupla.TH_Toco, tupla.TH_Enf,
                tupla.INV_GastoPer, tupla.INV_BienesUso, tupla.INV_BienesCons, tupla.INV_ServNoPers, tupla.RED_Complejidad, tupla.RED_Centros, tupla.RED_PuestosSanit,
                tupla.RED_Camas, tupla.OB_Monto, tupla.OB_Detalle, tupla.OB_Estado, tupla.SD_Poblacion, tupla.SD_Mujeres,
                tupla.SD_Varones, tupla.SD_Muj_15a49, tupla.SD_Menores_6, tupla.PROD_Consultas, tupla.PROD_ConGuardia,
                tupla.PROD_PorcConGuardia, tupla.PROD_Egresos, tupla.ConsMed_5años, tupla.ConMedGuardia_5años, tupla.Egre_5años,
                tupla.ES_Hosp, tupla.SD_Mayores_65_años, tupla.TH_Conducción, tupla.INV_GastoPer2018, tupla.INV_BienesUso2018,
                tupla.INV_BienesCons2018, tupla.INV_ServNoPers2018, tupla.RF_Total_facturado, tupla.RF_Total_cobrado,
                tupla.RF_Total_fact2018, tupla.RF_Total_Cobrado2018, tupla.PACES_Facturado, tupla.PACES_Facturado_Acumulado,
                tupla.PACES_Pagado, tupla.PACES_PagadoAcum, tupla.PACES_Pagado_2018, tupla.PACES_Facturado_2018, tupla.Vehi_Ambulancias,
                tupla.Vehi_Otros_vehiculos, updated]
            ]);
        });
        return this.db.sqlBatch(insertRows);
    }

    insertMultipleProf(datosProf: any) {
        let insertRows = [];
        let updated = moment().format('YYYY-MM-DD HH:mm');
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
        let sql = 'UPDATE profesionales SET ESPECIALIDAD=trim(ESPECIALIDAD), CATEGORIA_DESC=trim(CATEGORIA_DESC)';
        try {
            return this.db.executeSql(sql, []);
        } catch (err) {
            return (err);
        }
    }

    insertMultipleMortalidad(datosMort: any) {
        let insertRows = [];
        let updated = moment().format('YYYY-MM-DD HH:mm');

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
                tupla.TMAPE_V_Zona, tupla.TMAPE_V_Prov, tupla.TMI, tupla.TMI_Zona, tupla.TMI_Prov, tupla.IdArea, tupla.IdZona, tupla.Per_dd, updated]
            ]);
        });
        return this.db.sqlBatch(insertRows);
    }

    insertMultipleAutomotores(datosAut: any) {
        let insertRows = [];
        let updated = moment().format('YYYY-MM-DD HH:mm');

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
    delete() {
        let sql = 'DELETE FROM datosGestion';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }

    }
    deleteProf() {
        let sql = 'DELETE FROM profesionales';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }

    }
    deleteMort() {
        let sql = 'DELETE FROM mortalidad';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }
    }
    deleteAut() {
        let sql = 'DELETE FROM automotores';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }
    }

    limpiar() {
        let sql = 'DELETE FROM problemas';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }

    }

    limpiarImagenes() {
        let sql = 'DELETE FROM imagenesProblema';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
        } catch (err) {
            return (err);
        }

    }

    deleteMinutas() {
        let sql = 'DELETE FROM minuta';
        try {
            this.db.executeSql(sql, []);
            this.db.executeSql('VACUUM', []);
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
            .catch(error => error);
    }
    obtenerDatosProf() {
        let sql = 'SELECT * FROM profesionales';
        return this.db.executeSql(sql, [])
            .then(response => {
                let datos = [];

                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return Promise.resolve(datos);
            })
            .catch(error => error);
    }
    obtenerDatosMortalidad() {
        let sql = 'SELECT * FROM mortalidad';

        return this.db.executeSql(sql, [])
            .then(response => {
                let datos = [];

                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return Promise.resolve(datos);
            })
            .catch(error => error);
    }
    obtenerDatosAutomotores() {
        let sql = 'SELECT * FROM automotores';

        return this.db.executeSql(sql, [])
            .then(response => {
                let datos = [];

                for (let index = 0; index < response.rows.length; index++) {
                    datos.push(response.rows.item(index));
                }
                return Promise.resolve(datos);
            })
            .catch(error => error);
    }


    obtenerMinutas() {
        let sql = 'SELECT * FROM minuta';
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

    obtenerMinuta(id) {
        let sql = 'SELECT fecha, quienRegistra,participantes, temas,conclusiones,pendientes,fechaProxima,lugarProxima,origen FROM minuta WHERE idMinuta = "' + id + '"';
        try {
            return this.db.executeSql(sql, []).then(response => {
                return Promise.resolve(response.rows.item(0));
            })

        } catch (err) {
            return (err);
        }
    }
    obtenerListadoProblemas() {
        let sql = 'SELECT * FROM problemas';
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
    obtenerImagenes() {
        let sql = 'SELECT * FROM imagenesProblema';
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

    obtenerImagenesProblemasPorId(id) {
        let sql = 'SELECT * FROM imagenesProblema where  ID_PROBLEMA = "' + id + '"';
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

    updateEstadoProblema(task: any) {
        let sql = 'UPDATE problemas SET estado=?, necesitaActualizacion=? WHERE idProblema=?';
        try {
            return this.db.executeSql(sql, [task.estado, 1, task.idProblema]);
        } catch (err) {
            return (err);
        }
    }

    updateEstadoActualizacion(task, objectId) {
        let sql = 'UPDATE problemas SET necesitaActualizacion=?, objectId=? WHERE idProblema=?';
        try {
            return this.db.executeSql(sql, [0, objectId, task.idProblema]);
        } catch (err) {
            return (err);
        }
    }

    updateMinutaProblema(idMinutaSQL, idMinutaMongo, idProblema) {
        let sql = 'UPDATE problemas SET idMinutaSQL=?, idMinutaMongo=? WHERE idProblema=?';
        try {
            return this.db.executeSql(sql, [idMinutaSQL, idMinutaMongo, idProblema]);
        } catch (err) {
            return (err);
        }
    }

    updateActualizacionMinuta(task, objectId) {

        let sql = 'UPDATE minuta SET necesitaActualizacion=?, idMongo=? WHERE idMinuta=?';
        try {
            return this.db.executeSql(sql, [0, objectId, task.idMinuta]);
        } catch (err) {
            return (err);
        }
    }
    updateMinuta(idMinuta, minuta, origen) {
        let sql = 'UPDATE minuta SET fecha=?, quienRegistra=?,participantes=?,temas=?,conclusiones=?,pendientes=?, fechaProxima=?,lugarProxima=?,origen=?,  necesitaActualizacion=?  WHERE idMinuta=?';
        try {
            return this.db.executeSql(sql, [minuta.fecha, minuta.quienRegistra, minuta.participantes, minuta.temas,
            minuta.conclusiones, minuta.pendientes, minuta.fechaProxima, minuta.lugarProxima, origen, 1, idMinuta]);
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
            let datos: any = await this.network.get('modules/mobileApp/datosGestion', params)
            // let datos: any = await this.network.get('mobile/migrar', params)
            // let datos: any = await this.network.getMobileApi('mobile/migrar', params)
            let cant = datos ? datos.lista.length : 0;
            if (cant > 0) {
                await this.delete();
                await this.insertMultiple(datos.lista);
                migro = true;
            }
            let cantProf = datos ? datos.listaProf.length : 0;
            if (cantProf > 0) {
                await this.deleteProf();
                await this.insertMultipleProf(datos.listaProf);
                await this.eliminarEspaciosEspecialidades();
                migroProf = true;

            }
            let cantMort = datos ? datos.listaMort.length : 0;
            if (cantMort > 0) {
                await this.deleteMort();
                await this.insertMultipleMortalidad(datos.listaMort);
                migroMort = true;

            }
            let cantAut = datos ? datos.listaAut.length : 0;
            if (cantAut > 0) {
                await this.deleteAut();
                await this.insertMultipleAutomotores(datos.listaAut);
                migroAut = true;

            }
            if (migro && migroProf && migroMort && migroAut) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return (error);
        }
    }

    async executeQuery(query) {
        try {
            let datos = await this.db.executeSql(query, []);
            let rta = [];
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


    // async localidadesPorZona(idZona) {
    //     try {
    //         let query = 'SELECT DISTINCT IdLocalidad,Localidad FROM datosGestion where IdZona=' + idZona;
    //         let datos = await this.db.executeSql(query, []);
    //         let rta = [];
    //         // let rta = datos.rows.item(0);
    //         for (let index = 0; index < datos.rows.length; index++) {
    //             rta.push(datos.rows.item(index));
    //         }
    //         return rta;
    //     } catch (err) {
    //         return (err);
    //     }

    // }
    async areasPorZona(idZona) {
        try {
            let query = 'SELECT DISTINCT IdArea,Area FROM datosGestion where IdZona=' + idZona;
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
    // async efectoresPorLocalidad(id) {
    //     try {
    //         let query = 'SELECT DISTINCT IdEfector, Efector FROM datosGestion where IdLocalidad=' + id;
    //         let datos = await this.db.executeSql(query, []);
    //         let rta = [];
    //         for (let index = 0; index < datos.rows.length; index++) {
    //             rta.push(datos.rows.item(index));
    //         }
    //         return rta;
    //     } catch (err) {
    //         return (err);
    //     }
    // }

    async efectoresPorZona(id) {
        try {
            let query = 'SELECT DISTINCT idEfector, Efector, ES_Hosp FROM datosGestion where IdArea=' + id;
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

    // Actualiza la DB de mongo con los reportes nuevos o modificados (necesitaActualizacion === 1)

    async maxPeriodo() {
        try {
            let query = 'SELECT MAX(Periodo) as Periodo FROM datosGestion';
            let datos = await this.db.executeSql(query, []);
            if (datos.rows.length) {
                return datos.rows.item(0).Periodo;
            } else {
                return null;
            }
        } catch (err) {
            return (err);
        }
    }

    async desdePeriodoMortalidad() {
        try {
            let query = 'SELECT MAX(Per_dd) as Per_dd FROM mortalidad';
            let datos = await this.db.executeSql(query, []);
            if (datos.rows.length) {
                return datos.rows.item(0).Per_dd;
            } else {
                return null;
            }
        } catch (err) {
            return (err);
        }
    }

    async hastaPeriodoMortalidad() {
        try {
            let query = 'SELECT MAX(Per_h) as Per_h FROM mortalidad';
            let datos = await this.db.executeSql(query, []);
            if (datos.rows.length) {
                return datos.rows.item(0).Per_h;
            } else {
                return null;
            }
        } catch (err) {
            return (err);
        }
    }

    async sqlToMongoProblemas() {
        try {
            let listadoProblemas = await this.obtenerListadoProblemas();
            let listadoImg = await this.obtenerImagenes();
            let resultadoBusqueda = listadoProblemas.filter(item => item.necesitaActualizacion === 1);
            listadoImg = listadoImg.filter(img => resultadoBusqueda.some(prob => prob.idProblema === img.ID_PROBLEMA))

            for (let index = 0; index < resultadoBusqueda.length; index++) {
                let adjuntosAux;
                resultadoBusqueda[index].estado = resultadoBusqueda[index].estado.toLowerCase();
                adjuntosAux = listadoImg.filter(item => resultadoBusqueda[index].idProblema === item.ID_PROBLEMA);
                adjuntosAux = adjuntosAux.map(adj => adj.BASE64);
                let element = {
                    idProblema: resultadoBusqueda[index].idProblema,
                    quienRegistra: resultadoBusqueda[index].quienRegistra,
                    responsable: resultadoBusqueda[index].responsable,
                    problema: resultadoBusqueda[index].problema,
                    estado: resultadoBusqueda[index].estado,
                    origen: resultadoBusqueda[index].origen,
                    descripcionOrigen: resultadoBusqueda[index].descripcionOrigen,
                    plazo: resultadoBusqueda[index].vencimientoPlazo,
                    referenciaInforme: resultadoBusqueda[index].referenciaInforme,
                    fechaRegistro: resultadoBusqueda[index].fechaRegistro,
                    adjuntos: adjuntosAux,
                    idMinutaSQL: resultadoBusqueda[index].idMinutaSQL,
                    idMinutaMongo: resultadoBusqueda[index].idMinutaMongo,
                }
                if (!resultadoBusqueda[index].objectId) {
                    await this.postMongoProblemas(element);
                } else {
                    element['objectId'] = resultadoBusqueda[index].objectId;
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
            let listado: any = await this.getMongoProblemas();
            if (listado) {
                await this.limpiar();
                await this.limpiarImagenes();
            }
            for (let index = 0; index < listado.length; index++) {
                const element = listado[index];
                // inserta en dispositivo local
                this.insertProblemas(element, element.adjuntos, element.origen, 0, element.id, element.idMinutaSQL, element.idMinutaMongo)
            }
        } catch (err) {
            return (err);
        }
    }
    async sqlToMongoMinutas() {
        try {
            let listadoMinutas = await this.obtenerMinutas();
            let resultadoBusqueda = listadoMinutas.filter(item => item.necesitaActualizacion === 1);
            for (let index = 0; index < resultadoBusqueda.length; index++) {
                let element = {
                    idMinuta: resultadoBusqueda[index].idMinuta,
                    quienRegistra: resultadoBusqueda[index].quienRegistra,
                    participantes: resultadoBusqueda[index].participantes,
                    temas: resultadoBusqueda[index].temas,
                    conclusiones: resultadoBusqueda[index].conclusiones,
                    pendientes: resultadoBusqueda[index].pendientes,
                    fechaProxima: resultadoBusqueda[index].fechaProxima,
                    lugarProxima: resultadoBusqueda[index].lugarProxima,
                    origen: resultadoBusqueda[index].origen,
                    fecha: resultadoBusqueda[index].fecha,
                }
                if (!resultadoBusqueda[index].idMongo) {
                    await this.postMongoMinuta(element);
                } else {
                    await this.patchMongoMinuta(element, resultadoBusqueda[index].idMongo);
                }
            }
        } catch (err) {
            return (err);
        }
    }


    async mongoToSqlMinutas() {
        try {
            let listado: any = await this.getMongoMinuta();
            if (listado) {
                for (let index = 0; index < listado.length; index++) {
                    const element = listado[index];
                    // inserta en dispositivo local
                    this.insertMinuta(element, element.origen, 0, element.id)
                }
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


}
