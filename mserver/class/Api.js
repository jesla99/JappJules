/* Clase abstracta para endpoint para miniserver
Programada por: jesus Laynes.

version: 1.0
version 1.1 Se programa body inyectado con ? ejemplo GET /endpoint?var=sdsds

*/


class Api{

    constructor(conn){
        this.conn=conn
    }

    async run(verb, endPoint, body){
        console.log(`[${verb}]`, endPoint)

        const parts = endPoint.split("/")
        const base = this[verb]==undefined?{}:this[verb]
        for (let i in base){
            const endPart=i.split('/')
            if (endPart.length == parts.length){
                let match=0
                for (let p=0; p<parts.length; p++){
                    
                    if (parts[p]==endPart[p]) match++
                    if (endPart[p].indexOf(":") > -1) match++
                }

                if(parts.length == match){
                    
                    if (typeof base[i] == 'string') {
                        return await this['route'][base[i]](parts, body)
                    }else if (typeof base[i] == 'function'){    
                        return await base[i](parts, body) 
                    } else
                        return {error:"No existe una función interna que responda a este end point."}
                }
            }
        }
        


        return {error:"Ruta no encontrada"}
    }
}

module.exports = Api