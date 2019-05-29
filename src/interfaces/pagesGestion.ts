
export interface IAccionGestion {
    'titulo': String; // Nombre o descripción de la acción
    'consulta': string; // consulta a SQLite
    'valor': any; // referencia, o objeto con datos
    'goto': String; // link a la siguiente pagina a la que se dirige al hacer click
    'icono': String; // icono para mostrar junto al titulo
}

export interface IPageGestion {
    'titulo': String; // titulo de la pagina
    'template': String; // template de la pagina ... TODO ver si es necesario
    'tipo': string; // tipo de template que debe mostrar la pagina
    'mapa'?: String; // para la paginas que muestran un mapa aca iría el svg
    'tamanoMapa'?: String;
    'showEstadisticas'?: boolean;
    'acciones': IAccionGestion[]; // conjunto de información que ejecuta alguna accion
}
