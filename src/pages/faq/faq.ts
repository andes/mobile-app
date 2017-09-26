import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {
  public faqs: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

    this.faqs = [{
      'pregunta': '¿Cómo está constituido el sistema de Salud de la Provincia de Neuquén?',
      'respuesta': 'El Sistema de Salud de la provincia está conformado por tres subsistemas que coexisten y se interrelacionan. El Subsistema Público, el Subsistema Privado, y el Subsistema de los financiadores conformado por las obras sociales, prepagas o planes provinciales o nacionales que brindan algún tipo de cobertura de salud.'
    },
    {
      'pregunta': '¿Cómo está organizado el sistema de Salud Pública de la Provincia de Neuquén?',
      'respuesta': 'El Sistema de Salud de la Provincia está formado por un conjunto de Centros de Salud y Hospitales de distinta complejidad, organizados en forma de Red. Eso implica que los ciudadanos, de acuerdo a sus necesidades de  salud serán derivados automáticamente al Hospital de la complejidad  apropiada. Incluso a prestadores del subsistema privado o a centros de mayor complejidad a nivel nacional.'
    },
    {
      'pregunta': '¿Quiénes pueden acceder al Sistema de Salud Pública de la Provincia?',
      'respuesta': 'Todos los ciudadanos  que necesiten atención, pueden acceder al Sistema de Salud Pública de la Provincia'
    },
    {
      'pregunta': '¿Por qué es necesario estar correctamente identificado?',
      'respuesta': 'La identificación de los ciudadanos es crucial para los procesos de salud ya que, si está correctamente identificado y validado, podrás sacar turnos a través de la aplicación móvil, desde cualquier ventanilla y desde el portal de ciudadanos.' +
      '<br />' +
      'La correcta identificación también evitará que hagas largas colas para acceder a las prestaciones del Sistema de Salud' +
      '<br />' +
      'Sobre todo, es que disminuye la posibilidad de que se cometan errores. Aumentando así la seguridad en los procesos que involucran a tu salud.'
    },
    {
      'pregunta': '¿Cómo puedo identificarme?',
      'respuesta': 'Presentando el  documento de identidad actualizado. Podés hacerlo en cualquier ventanilla de los Centros de Salud y Hospitales. Podés acercarte a cualquiera de los puntos de Acreditación de ANDES. O podés hacerlo vos mismo bajándote la aplicación de ANDES y escaneando tu DNI.'
    },
    {
      'pregunta': 'Si tengo Obra Social... ¿Puedo acceder al Sistema de Salud Pública de la Provincia?',
      'respuesta': 'Si. El sistema de Salud Pública es un prestador más de salud. Si tenés obra social  o una prepaga, Salud Pública le facturará a tu Obra Social, las prestaciones que se te hayan brindado.'
    },
    {
      'pregunta': '¿Cómo obtengo un turno?',
      'respuesta': 'Inicialmente, puede acercarse al Hospital, o centro de Salud Provincial más cercano a su domicilio. Si su problema de salud puede ser resuelto allí, le darán un turno y si su problema de salud requiere de atención más compleja, lo derivarán  al Hospital de la complejidad correspondiente.'
    },
    {
      'pregunta': '¿Cómo obtengo un turno para acceder a los especialistas?',
      'respuesta': 'Los turnos para acceder a las especialidades se tramitarán a través de los efectores de Salud más cercano a su domicilio, o, en caso de contar con una llave electrónica a través de ANDES podrá sacarlo Ud. mismo a través de la aplicación.'
    }
    ]
  }

}
