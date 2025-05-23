import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriasProvider } from 'src/providers/historia-salud/categorias';
import { ToastProvider } from 'src/providers/toast';
import { StorageService } from 'src/providers/storage-provider.service';

@Component({
    selector: 'app-historia-salud',
    templateUrl: './historia-salud.page.html',
})
export class HistoriaSaludPage implements OnInit {
    familiar: any = false;
    public categorias = [];

    constructor(
        private toastCtrl: ToastProvider,
        private categoriasProvider: CategoriasProvider,
        private router: Router,
        private storage: StorageService
    ) {}

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
            this.categoriasProvider
                .get({})
                .then(async (categorias: any) => {
                    this.categorias = categorias;
                })
                .catch((error) => {
                    if (error) {
                        this.toastCtrl.danger(
                            'Ha ocurrido un error al obtener las categorías.'
                        );
                    }
                });
        });
    }

    verCategoria(categoria) {
        if ((categoria.titulo === 'Recetas')) {
            this.router.navigate(['historia-salud/recetas']);
        } else {
            this.router.navigate(['historia-salud/detalle'], {
                queryParams: { categoria: JSON.stringify(categoria) },
            });
        }
    }
}
