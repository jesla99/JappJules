export default class Hilo{
    drv
    constructor(tag, props, drv:any){
        this.drv=drv
        console.log("Hilo.tirar", tag, this.drv)
        tag['tirar']=(...e)=>{
            if (drv['alTirar'] == undefined ){
                return {error: "Este elemento posee un Gancho, pero no posee el evento"}
                /*
                this.drv=drv
                //si es un tagHTML devolvemos MiReact
                if (e[2] instanceof Array) e[2] = this.render(e[2])

                return drv.createElement(e[0], e[1], e[2])
                */
            } else {
                //Si es un componente devolvemos el resultado de alHilo
                return drv['alTirar'](...e)
            }            
        }
    }

    render(e){
        return e.map(i=>{
            if (i[2] != undefined ) {
                if (i[2] instanceof Array) i[2] = this.render(i[2])
            }
            return this.drv.createElement(i[0], i[1], i[2])
        })
    }
}