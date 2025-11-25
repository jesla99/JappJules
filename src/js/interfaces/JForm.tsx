export interface JitemFrm{
    campo:string   //Nombre del campo
    valor?:any     //valor inyectado en el formulario, ideal para llaves foráneas al momento de crear formularios, el valor se toma en en ausencia de datos de registro.
    label?:string //Etiqueta para el input del formulario, si no se define se buscará en [mask] si mask esta definido 
    tipo?:string //define el tipo de input, se sume text
    req?:boolean //indica si el campo es requerido
    readonly?:number //0=disponible en nuevo formulario y en edición
                    //1=solo lectura en creación
                    //2=solo lectura en edición
                    //3=solo lectura tanto en edición como en creación
    visible?:boolean  //indica si el campo será visible por defecto true
    placeholder?:string //contenido de pista para el elemento (campo)
    class?:string //Define una clase de css aplicable al input
    props?:any //propiedades para el campo
}

export interface JformParam{
    tabla?:string 
    reg:any //objeto con el registro para el formulario
    titulo:string
    key?:string //campo con la llave principal
    id?:string //identificador del formulario en el DOM
    campos:JitemFrm[] //array de items tipo itemFrm
    callBack:Function //funcion de retorno en caso de acciones del campo
    //cambiado or reg data?:any //datos del formulario en caso de lectura o edición del formulario
    full?:boolean //true = indica si el campo ocupara una fila, false = el campo se compartará como letra (inline-block)
    dinamico?:boolean //por defecto true, indica si la carga será dinámica, es decir que se cargará si y solo si se ingresa a la tab que contiene el vform
    botones?:string[]   //cadena de botones
}

