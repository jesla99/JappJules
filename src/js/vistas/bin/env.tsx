export const buffer:any[] = []
export const vars:any={PVID:0}  //View Process ID
const appConfig:any = {
    restNamespace:"alChaz",
    restServer:"https://jrbod.alchaz.com",
    restVersion:"b1",
    restSchema:"dev",
    restToken:"Web",
    disponible:true
}
export const preload:string="./js/vistas/bin/preload.gif" //ruta absolutam en caso de ser vacia se usa preload por defecto
export const notiWait=10  //tiempo de espera para no recibir re mensajes despues de recibir un mensaje interno enviado por this.enviar
export default appConfig  //Parametros de configuracion para rest
export const runLevel:number=1 //0:en linea 1:local 2:mixto. nivel de ejecucion por defecto en peticiones rest
//valores por defecto para contruccion del conector rest
export const restDefault={
    superReq:true
}
//Objeto de versiones rest
export const restDB = {}

//sockets para webRTC P2P - pc1-----pc2
//export const nsockets=["socket1", "socke2", "socket3", "socket4"]
export const nsockets=[]
//Mi socket, 
export const miSocket = ""