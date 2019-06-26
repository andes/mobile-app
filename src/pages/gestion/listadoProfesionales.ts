import { IPageGestion } from './../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';

@Component({
    selector: 'listadoProfesionales',
    templateUrl: 'listadoProfesionales.html',
    styles: ['listadoProfesionales.scss']
})

export class ListadoProfesionalesComponent implements OnInit {

    @Input() activePage: IPageGestion;

    @Input() dataPage: any;
    public backPage: IPageGestion;
    public listaItems = [];
    public listado = [
        {
            nombreCompleto: 'Santarelli,Marco Santarelli',
            profesion: 'Trumatologo'
        },
        {
            nombreCompleto: 'Diaz,Bruno',
            profesion: 'Fonoudiologo'
        },
        {
            nombreCompleto: 'Martinez,brayan',
            profesion: 'Medico'
        },
        {
            nombreCompleto: 'El hombre,Araña',
            profesion: 'Medico'
        },
        {
            nombreCompleto: 'Stark,Tony',
            profesion: 'Medico'
        },
        {
            nombreCompleto: 'White,Walker',
            profesion: 'Medico'
        },
    ]

    public textoLibre;
    public listadoTemporal;
    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider
    ) { }


    ngOnInit() {
        console.log('decime algoooooooooo')
        this.listadoTemporal = this.listado;
        this.cargarValores();
    }


    public buscar($event) {
        // console.log($event)

        this.listadoTemporal = this.listado.filter((item: any) =>

            ((item.usuario) ? (item.usuario.trim().toUpperCase().search(this.textoLibre.toUpperCase()) > -1) : '') ||
            ((item.nombreCompleto) ? (item.nombreCompleto.trim().toUpperCase().search(this.textoLibre.toUpperCase()) > -1) : '') ||
            ((item.profesion) ? (item.profesion.trim().toUpperCase().search(this.textoLibre.toUpperCase()) > -1) : '')
        );

    }
    async cargarValores() {
        console.log('activePage', this.activePage);
        console.log('dataPage', this.dataPage);
        if (this.activePage.valor) {
            let query = this.activePage.valor.replace(/{{key}}/g, this.dataPage.key);
            console.log('query', query)
            let consulta = await this.datosGestion.executeQuery(query);
            console.log('cons', consulta);

            if (consulta && consulta.length) {
                // this.listadoTemporal
            }

        }


    }
}
