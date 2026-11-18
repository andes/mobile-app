import { Component, ElementRef, HostListener, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'app-selector-sexo',
    templateUrl: 'selector-sexo.html',
    styleUrls: ['selector-sexo.scss']
})
export class SelectorSexoComponent implements ControlValueAccessor {
    @Input() ayuda = 'Seleccioná el sexo registrado en el DNI.';

    public opciones = [
        { valor: 'Femenino', texto: 'Femenino' },
        { valor: 'Masculino', texto: 'Masculino' },
        { valor: 'Otro', texto: 'No binario' }
    ];
    public valor = '';
    public abierto = false;
    public deshabilitado = false;

    private onChange: (valor: string) => void = () => { };
    private onTouched: () => void = () => { };

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        @Optional() @Self() private ngControl: NgControl) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    get textoSeleccionado(): string {
        return this.opciones.find(opcion => opcion.valor === this.valor)?.texto;
    }

    get requerido(): boolean {
        const control = this.ngControl?.control;
        return !!control && control.hasError('required') && control.touched;
    }

    writeValue(valor: string) {
        this.valor = valor || '';
        this.abierto = false;
    }

    registerOnChange(fn: (valor: string) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    setDisabledState(deshabilitado: boolean) {
        this.deshabilitado = deshabilitado;
        this.abierto = false;
    }

    alternar() {
        if (this.abierto) {
            this.cerrar();
        } else if (!this.deshabilitado) {
            this.abierto = true;
        }
    }

    seleccionar(valor: string) {
        this.valor = valor;
        this.onChange(valor);
        this.cerrar();
    }

    private cerrar() {
        this.abierto = false;
        this.onTouched();
    }

    @HostListener('document:click', ['$event'])
    onClickDocumento(event: Event) {
        if (this.abierto && !this.elementRef.nativeElement.contains(event.target as Node)) {
            this.cerrar();
        }
    }
}
