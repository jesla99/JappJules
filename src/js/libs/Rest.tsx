/**
 * Version 1.0.2: Se agrega la propiedad useVersion por defecto true, para indicar si el endpoint usara la version de restVersion del objeto de configuración.
 * Version 1.0.3: Se agrega la propiedad miniServer que por defecto hace referencia a la URL de JappN, pero que puede definir una ruta diferente. 
 * 
 * 
 * */ 

//archivo de configuracion general
import Config from "../Config.js"
//datos de configuracion del proyecto
import appConfig from "../vistas/bin/env.js"
import LocalServer from "./LocalServer.js"
import Dbase from "./dBase.js"
 
export default class Rest{
    version:"1.0.3"
    restAppID:string
    restServer:string
    restSchema:string
    restNamespace:string
    restVersion:string
    restToken:string
    
    useSuperToken:boolean=false; //sobre escribe tokens de otras apps implementar
    restSuperToken:boolean=false; //deprecar
    useVersion:boolean=true
    useCache:boolean=false
    superReq:boolean=false


    lazyElement:any=undefined
    restRef:HTMLElement
    restLocalSession:boolean=false //si la sesión de rest se almacena y busca localmente
    //local:number|boolean=false //deprecate
    restLevel:number=2 // nivel de acceso: 0=acceso local(navegador), 1=acceso servidor JappN (miniApi), 2=Acceso a jrApi y 3=Dinamico al fallar intenta consultar en otros servers.
    localServer:any //objeto que controla al servidor local
    mute:boolean=false  //sin preload
 
    miniServerPort=3000;//puerto para uso de restLevel 1
    miniServer=document.location.protocol+"//"+ document.location.hostname //direccion de miniserver por defecto localhost

 
    constructor(cfg:object|number={}){
        //1. cargar archivo principal de configuracion
        const objConfig = Config;

        //2. si en default hay super request.
        if (objConfig['superReq'] == true){
            for( var i in appConfig){
                objConfig[i]=appConfig[i];
            }
        }

        //3. Si se recibe config como parametro
        //3.1 si cfg es un objeto
        if (typeof cfg == "object"){
            for( var i in cfg){
                objConfig[i]=cfg[i];
            }
            if (cfg['superReq'] == true){
                    for( var i in appConfig){
                    objConfig[i]=appConfig[i];
                }
            }
        }else{ //3.2 si cfg es un numero
            //3.2.1 validar si existe una tabla de conexiones

        }

        for( var i in objConfig){
            this[i]=objConfig[i];
        }

        
        this.restVersion = this.useVersion? (cfg['restVersion']!=undefined?cfg['restVersion']:Config.restVersion):""


        //recuperar token y appID
        if (this.restLocalSession){
            if (this['restAppID'] != undefined){
                this.restToken = localStorage["jap"+this['restAppID']]??localStorage['japToken']
            }else{
                this.restToken = localStorage[window['japToken']]??localStorage['japToken']
                
            }
        }
       
        this.localServer = new LocalServer();
    }
 
 
    async get(endPoint) {
        return this.run("GET", endPoint);
    }
    async patch(endPoint, body) {
        return this.run("PATCH", endPoint, body);
    }
    async post(endPoint, body) {
        return this.run("POST", endPoint, body);
    }
    async put(endPoint, body) {
        return this.run("PUT", endPoint, body);
    }
    async delete(endPoint) {
        return this.run("DELETE", endPoint);
    }

    //consulta un contenido de forma asincrona y renderiza 
    async lazy(endpoint, contenedor=undefined){
        const indice = (typeof contenedor == "number")?contenedor:undefined

        if (typeof contenedor == "number") contenedor=undefined
        
        if (contenedor != undefined) {
            this.lazyElement = contenedor
        }
        
        //const ruta = "/js/vistas/page.html"
        //const render = document.querySelector("#lazy")
        const ext = endpoint.substring(endpoint.lastIndexOf(".")).toLowerCase()
                
        try {
            //const response =await fetch('https://api.example.com/datos-que-podrian-fallar');
            const response =await fetch(endpoint);
            const type = response.headers.get('Content-Type')
            let inRender:any = indice!=undefined?document.querySelector(".lz"+indice):this.lazyElement
            if (!response.ok) {
                if (this.lazyElement !== null && this.lazyElement !== undefined)
                    if (typeof this.lazyElement == "string" ) this.lazyElement = document.querySelector(this.lazyElement)
                    this.lazyElement.replaceWith(<span style="color:red">Error en la RED.</span>)
                return "Error en Red."
            }

            let data
            //console.log(ext, type)
            switch(type){
                case "image/png":
                case "image/jpg":
                case "image/jpeg":
                case "image/bmp":
                    data = await response.blob()
                    data = <img src={URL.createObjectURL(data)} />
                break
                case "text/css":
                    data = <style>{await response.text() }</style>
                break
                case "application/json":
                    data = await response.json()
                break
                case "application/octet-stream":
                    if ( ext == ".txt") data = await response.text()
                    else {
                        data = await response.blob()
                        if ( ext == ".mp3" || ext == ".wav" || ".mp4" ) {
                            data = <audio src={URL.createObjectURL(data)} />
                            data.controls = true
                        }
                        if ( ext == ".gif" ) data = <img src={URL.createObjectURL(data)} />
                    }
                break
                case "text/html":
                    data = <div></div>
                    data.innerHTML = await response.text()
            } 

            if (inRender !== undefined && inRender !== null){
                let renderData = data
                /**si el objeto debe ser modificado para presentar en pantalla */
                if (ext == ".json") renderData = JSON.stringify(data)

                if (typeof inRender == "string" ) 
                    inRender = document.querySelector(inRender)
                inRender.replaceWith(renderData)
            }

            
            return data

        } catch (error) {
            let inRender:any = indice!=undefined?document.querySelector(".lz"+indice):this.lazyRender
            console.log(error)
            if (inRender!= undefined)
                inRender.replaceWith(<span style="color:red">Error</span>)
            return "Error."
        }      
    }

    lazyRender(el:any){
        if (typeof el == "number") {
            return <img src="/js/vistas/bin/preload.gif" class={"lz"+el} />
        }else {
            this.lazyElement = <img src="/js/vistas/bin/preload.gif" />
            return this.lazyElement 
        } 
    }
 
    async run(method, endPoint, body = undefined) {
        /**Validar existencia en cache */
        if (this.useCache){
            const enCache = await this.getCache(method, endPoint, body)
            if (enCache != false){
                return enCache
            }
        }

        //preload
        const pre = document.querySelector("#preload");
        if (pre != null && !this.mute)
            pre['style'].display = "inline-block";
 
        //ejecutar llamada
        if (this.restLevel==0) //si es consulta a la api local en el navegador
            return await this.localServer.run(method, endPoint, body);
        else if (this.restLevel==1) //si es consulta al miniserver o miniapi
            return await fetch(this.miniServer+":"+this.miniServerPort+ endPoint, {
                method: method,
                headers: {
                    token: this.restToken,
                    app_id: this.restAppID,
                    _schema: this.restSchema,
                    namespace: this.restNamespace,
                },
                body: JSON.stringify(body)
            })
            .then(resp => resp.json())
            .then(data => {
                if (pre != null)
                    pre['style'].display = "none";
                return data;
            }).catch(err => {
                if (pre != null)
                    pre['style'].display = "none";
                console.log(err);
                return { error: 'Existió un error imprevisto.' };
            });
        else {//si es jrApi
            const encabezado={
                    isrest: "true",
                    token: this.restToken,
                    app_id: this.restAppID,
                    _schema: this.restSchema,
                    namespace: this.restNamespace,
                    lastUpdate: localStorage['jappnLastUpdate']??"0"
                }


            return await fetch(this.restServer + (this.useVersion?`/${this.restVersion}`:``) + endPoint, {
                method: method,
                headers: encabezado,
                body: JSON.stringify(body)
            })
            .then(resp => resp.json())
            .then(data => {
                //almacenar token y token-app_id
                if (this.restLocalSession){
                    if (data['token'] != undefined){
                        
                        if (data['app_id'] != undefined){
                            //window['app_id']=data['token']
                            localStorage["jap"+data['app_id']]=data['token']
                            //si debe aplicarse superToken
                            if (this.restSuperToken){
                                this.SuperT("set", data['token'])
                            }
                        }else{
                            localStorage['japToken'] = data['token']
                        }
                    }
                }

                //validar respuesta con formato mínimo correcto
            
                if (data['error'] == undefined){
                    if (pre != null)
                    pre['style'].display = "none";
                    console.log(data)
                    console.log("La respuesta no cumple con el formato de respuesta para JappN, no se encontró la llave de error en el response.")
                    return {error:"Formato de respuesta incorrecto, no se encontró el nodo de error en el response original."}
                }
                     
               
                //si hay preload lo oculta
                if (pre != null)
                    pre['style'].display = "none";

                /**almacenar en cache */
                if (this.useCache){
                    this.regCache(method, endPoint, body, data)
                    data['esCache']=false
                }

                return data;
            }).catch(err => {
                //console.log(err)
                //si hay preload lo oculta
                if (pre != null)
                    pre['style'].display = "none";
                console.log(err); //muestra el error imprevisto
                return { error: 'Existió un error imprevisto.' };
            });
        }
    }
    
    cerrarSesion(){
        if (this.restAppID){
            delete localStorage["jap"+this.restAppID]
            if(this.restSuperToken){
                this.SuperT("kill", "")
            }
            delete localStorage['japToken']
        }
    }

    SuperT(ac,val){

        if (this.restSuperToken && ac=="set") localStorage['japToken'] = val

        const allKeys = Object.keys(localStorage);
        for(let i in allKeys){
            //Si figura se un token japp
            let found=false
            if (allKeys[i].substring(0,3) == "jap"){
                const pApp = parseInt(allKeys[i].substring(3)) 
                //si el token japp es numerico
                if ( !isNaN(pApp) ){
                    if (ac=="set") localStorage[allKeys[i]] = val
                    if (ac=="kill") delete localStorage[allKeys[i]]
                    if (ac=="get") return localStorage[allKeys[i]]
                    if (ac=="next") {
                        if (!found) {
                            delete localStorage[allKeys[i]]
                            found=true
                        }else{
                            return localStorage[allKeys[i]]
                        }
                    }
                }
            }
        }
        return false

    }

    //registrar cache
    regCache(method, endPoint, payload, response){
        if (method != "GET") return 
        if (response.errores.length == 0){
            Dbase.nextno("_cache")
            .then(id=>{
                const reg = {
                    _cache_id:id,
                    verbo:method, 
                    endPoint:endPoint,
                    tablas: [Math.floor(Math.random() * (9)),Math.floor(Math.random() * (9)),Math.floor(Math.random() * (9))],
                    payload:payload,
                    response: response 
                }
                Dbase.create('_cache', reg)
                .then(data=>{
                    //despues de guardar evaluamos limpieza de cache
                    if (data['_meta_'] != undefined){
                        if (data['_meta_']['cache'] != undefined){
                            this.clearCache(data['_meta_']['cache'])
                        }
                    }
                })
            })
        }
    }

    //buscar cache
    async getCache(metodo, endpoint, payload){
        const enCache:any = await Dbase.find("_cache", {endPoint:endpoint, verbo:metodo, payload:payload})
        if (enCache != false){
            enCache.response['esCache']=true
            return enCache.response
        }
        return false
    }

    async clearCache(tablas){
        const encontrados = await Dbase.search("_cache", {tablas:tablas})
        console.log(encontrados)
    }
}