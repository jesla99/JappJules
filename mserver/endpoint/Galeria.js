const Api =require("../class/Api.js") 
const fs = require('fs');
const path = require('path');


class Galeria extends Api{
    POST={
        "/Galeria": ($p, $b)=> this.upLoad($p, $b)
    }

    GET={
        "/Galeria": ($p, $b)=> this.getDir($p, $b)
    }

    DELETE={
        "/Galeria": ($p, $b)=> this.borrar($p, $b)
    }

    /**body:
     * {
     *      "website_id": 1,
     *      "data": "cadena_base_64",  //nota: si no se postea data, se asume que esta creando carpetas.
     *      "ruta": "/archivo.jpg" | "/carpeta/archivo.jpg" | "carpeta_existente/carpeta_nueva"
     * }
     * 
     * ruta base: /assets/web{n}/
     */

     upLoad($parts, $body){
        if ($body['website_id'] == undefined) return {error: "Se esperaba un website_id"}
        let path=this.linuxPath()

        if ($body["ruta"][0] == "/") $body["ruta"] = $body["ruta"].replace("/", "")
        const $chunks = $body['ruta'].split("/")
        var $archivo = $body['data']==undefined?"":$chunks.splice($chunks.length - 1, 1)[0]
        const base = path+ "/assets/web"+$body["website_id"]+"/"
        
        //validar que existe la carpeta base de imágenes
        if ( !fs.existsSync(base) ){
            try{
                fs.mkdirSync(base, {recursive:true})
                console.log("ruta creada",base)
            }catch(e){
                console.log("Error ", e)
                return {error:"Error al intentar crear la carpeta de imagenes."}
            }
        }

        let baseFull=base
        if ($chunks.length > 0){
            baseFull = base + $chunks.join("/")
            if ( !fs.existsSync(baseFull) ){
                try{
                    fs.mkdirSync(baseFull, {recursive:true})
                    console.log("ruta creada", base + $chunks.join("/"))
                }catch(e){
                    console.log("Error ", e)
                    return {error:"Error al intentar crear subcarpetas de imagen"}
                }
            }
        }

        if ($archivo != undefined && $archivo !=""){
            try{
                $archivo = this.valNombre (baseFull, $archivo)
                fs.writeFileSync(baseFull+"/"+$archivo, $body.data, 'base64')
            }catch(e){
                console.log("error:", e)
                return {error:"No fue posible guardar el archivo: "+ $archivo}
            }
        }

        return {error:"", ruta:"/assets/web"+ $body["website_id"] +"/"+$chunks.join("/"), archivo:$archivo}
    }

    /**
     * Body inyectado
     * {
     *      website_id:1,
     *      ruta: "carpeta/subcarpeta/archivo.js" | "carpeta/subcarpeta"
     * }
     * 
     */
    borrar(p,$body){
        if ($body['website_id'] == undefined) return {error: "Se esperaba un website_id"}
        let path=this.linuxPath()
        if ($body["ruta"][0] == "/") $body["ruta"] = $body["ruta"].replace("/", "")
        const archivo = path+ "/assets/web"+$body["website_id"]+"/"+$body["ruta"]

        if ( fs.existsSync(archivo) ){
            try{
                fs.unlinkSync(archivo)
            }catch(e){
                return {error:"No es posible eliminar el recurso."}
            }
        }else{
            return {error: "El recurso a eliminar no existe."}
        }

        return {error:""}

    }


    linuxPath(){
        let path=require.main.path
        let dist =""

        if (path[0]=="C" ){
            let p=path.split('\\')
            p.shift()
            path = "/"+p.join("/")+"/.."
        }

        if ( fs.existsSync(path + "/dist") ){
            path += "/dist"
        }

        return path
    }

    valNombre(ruta, archivo){
        //console.log(archivo)
        if ( !fs.existsSync(ruta+"/"+archivo) ) return archivo
        else {
            const regex = /\(\d+\)$/
            const p=archivo.split(".")
            if ( regex.test(p[0]) ){
                const p1 = p[0].lastIndexOf('(')
                const p2 = p[0].lastIndexOf(')')
                const numero = parseInt(p[0].substring(p1+1,p2))
                return this.valNombre(ruta, archivo.substring(0,p1+1) + (numero+1) +  archivo.substring(p2))
            }else{
                return this.valNombre(ruta, p[0]+"(1)."+p[1])
            }
        }
    }

    /**
     * body inyectado
     * GET /Galeria?website_id=1&ruta=eventos
     * 
     * {
     *      website_id: 1,
     *      ruta: "carpeta/sub_carpeta"
     * }
     * 
     */
    getDir(p, b){
        if (b['website_id'] == undefined) return {error: "Se esperaba un website_id"}

        const path = this.linuxPath()
        const base="/assets/web"+b['website_id']+"/"+b['ruta']
        const rutaCarpeta = path + base

        const resultado = [];

        try {
            // 1. Obtener la lista de nombres de recursos
            const nombres = fs.readdirSync(rutaCarpeta);

            // 2. Iterar y obtener el tipo de cada recurso
            for (const nombre of nombres) {
                //const rutaCompleta = path.join(rutaCarpeta, nombre);
                const stat = fs.statSync(rutaCarpeta + "/" + nombre); // Obtiene información del recurso

                let tipo;
                if (stat.isDirectory()) {
                    tipo = 'directorio';
                } else if (stat.isFile()) {
                    tipo = 'archivo';
                } else {
                    tipo = 'otro';
                }

                resultado.push({
                    nombre: nombre,
                    tipo: tipo
                });
            }

            return {error:"", res:resultado, ruta:base};

        } catch (error) {
            console.error(`Error síncrono al leer la carpeta ${rutaCarpeta}:`, error.message);
            return {error:"No fue posible leer la carpeta"};
        }

    }
}

module.exports = Galeria