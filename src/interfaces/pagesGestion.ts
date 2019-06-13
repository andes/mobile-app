
export interface IAccionGestion {
    'titulo': string; // Nombre o descripción de la acción
    'consulta': string; // consulta a SQLite
    'valor': any; // referencia, o objeto con datos
    'goto': string; // link a la siguiente pagina a la que se dirige al hacer click
    'icono': string; // icono para mostrar junto al titulo
}

export interface IPageGestion {
    'origen'?: string;
    'titulo': string; // titulo de la pagina
    'template'?: string; // template de la pagina ... TODO ver si es necesario
    'tipo': string; // tipo de template que debe mostrar la pagina
    'mapa'?: string; // para la paginas que muestran un mapa aca iría el svg
    'tamanoMapa'?: string;
    'periodicidad'?: string;
    'tituloCompleto'?: string;
    'showEstadisticas'?: boolean;
    'acciones': IAccionGestion[]; // conjunto de información que ejecuta alguna accion
    'valor'?: any; // para la paginas que muestran un mapa aca iría el svg
}
