/************
 * 
 * Libreria obsoleta, rempazada por React.lazy
 * 
 */

//import JappN from "./JappN.js";
import React from "./MiReact.js";
interface lazyParam{
    ref?:HTMLDivElement,
    /**Indica si se usará cache volátil, es decir cache en memoria ram para aceeso mas rápido de la aplicación */
    useLazyCache?:boolean,
    /** Incica si se usará memoria cache de disco, memoria fija */
    lazyCacheHard?:boolean,
    /** Indica cuandos segundos de vida tendrá la memoria cache volátil */
    lazyCacheTimeout?:number
}

class Lazy {
    timeout: number = 10000;
    timer
    //retorna el contenido renderizado 
    importar(url: string, props: any = {}) {
        return new Promise((bien, mal) => {
            import(url).then((data: any) => {
                const es = React.estoEs(data.default);
                if (es == 'class') {
                    if (data.default.__proto__.name == 'JappM') { //Si es instancia de JappM
                        //OBJS render directo React.Crear(new data.default().alCargar(props), this.ref, { cls: true });
                        
                        // let vista= new data.default().alCargar(props)
                        // bien( vista )
                        bien (data.default)
                        
                        clearInterval(this.timer);
                    } else { //si es una clase cualqueira
                        bien(data.default);
                        clearInterval(this.timer);
                    }
                } else if (es == 'function') {
                    let vista = data.default(props)

                    let nombre = null//vista.getAttribute('nombre')
                    bien(vista)
                    
                    clearInterval(this.timer);
                } else {
                    bien(data.default);
                    clearInterval(this.timer);
                }
            });
        });
    }

    

    limpiarCache( ob:any={} ){
        const llaves =  Object.keys(ob)
        if ( llaves.length == 0  ) localStorage.lazyCache="[]"
        else{
            if ( ob.fnd != undefined ){
                let cache = JSON.parse(localStorage.lazyCache)
                for ( var i=cache.length-1; i>-1; i--){
                    if(cache[i].fnd == ob.fnd){
                        cache.splice(i,1)
                    }
                }
                localStorage.lazyCache = JSON.stringify(cache);

                cache = globalThis.lazyCache
                for ( var i=cache.length-1; i>-1; i--){
                    if(cache[i].fnd == ob.fnd){
                        cache.splice(i,1)
                    }
                }
            }
        }
    }

}

export default Lazy