/** Interface para mensajes de this.enviar() */
export interface infMensaje{
    //nombre del componente destino, vacio o inexistente = * (todos los elementos, se ejecuta propagacion 4 broadcast)
    destino?:string
    //cualquier mensaje, elemento html, cadena u objeto json
    mensaje:any
    //indica si requiere confirmación de ejecución
    confirmar?:boolean
    //direccion de la propagación 0 o inexistnte solo el destino, 1 hacia adelante de la rama, 2 hacia el tronco, 3 hacia la rama y el tronco y 4 broadcast
    propagacion?:number
    //Contexto del emisor, asignado ppor Japp durante el envio del mensaje
    ctxEmisor?:any
}