export interface tabsParam{
    id:string
    class?:string
    res?:tabParam[]
    onOpen?:Function	//Se ejecuta cada vez que se abre una paestaña por primera vez y esta esta vacia
    forceOpen:boolean	///indica que onopen se debe ejecutar siempre por defecto false
    mini?:boolean //indica si las pestañas se colapsan y muestran solo iconos
  }
  
  export interface tabParam{
    tab?:string
    icono?:string
    contenido:string|HTMLDivElement
    sel?:boolean
  }