/**Clase primaria para endpoints locales */

export default class Local{
    rutas:any
    async run(verb, endPoint, body={}){
        const parts = endPoint.split("/")
        const base = this.rutas[verb]==undefined?{}:this.rutas[verb]

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
                        return await this[base[i]](parts, body)
                    }else if (typeof base[i] == 'function'){    
                        return base[i](parts, body) 
                    } else
                        return {error:"No existe una función interna que responda a este end point."}

                }
            }
        }
        


        return {error:"Ruta no encontrada"}
    }   
}