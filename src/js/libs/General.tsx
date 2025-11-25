//import { miSocket } from "../vistas/bin/env.js";
import Dbase from "./dBase.js";
import nSocket from "./NSocket.js";

const General=()=>{
    document.addEventListener("keydown", (e) => {
        const doc = document.querySelectorAll("#root *");
        let eject=false
        for(let i=doc.length;i>0;i--){
            const el = doc[i-1]
            if (el['_alKeyDown'] != undefined){
                if (!eject) {
                    eject=true
                    el['_alKeyDown'](e)
                }else{
                    //console.log("stop propagation")
                }
            }
        }
    });
};

export const setDB=(dsn)=>{
    return new Promise((retorno)=>{
        Dbase.abrir(dsn)
        .then((data:any)=>{
            if(data.autonum ){
                console.log('creando estructura')
                dsn.stores.forEach(async(store) => {
                    console.log(store.name)
                    const transaction = data.transaction('_schema_','readwrite');
                    const strc = transaction.objectStore('_schema_');
                    const rq = strc.add({tabla:store.name, auto:1})
        
                    rq.onerror = (e) => {  
                    //console.log("Esquema: ", e)
                    };
                })
            }  
            retorno({new:data.autonum})
        })
    })
}

export const setTabla = (store, data)=>{
    return new Promise(async (retorno)=>{
        if (data instanceof Array){
            for (let i=0; i<data.length;i++){
                const r=data[i]
                const id = await Dbase.nextno(store)
                r[store+'_id'] = id
                await Dbase.create(store, r)
            }
        }else{
            const id = await Dbase.nextno(store)
            data[store+'_id'] = id
            await Dbase.create(store, data)
        }
        
        retorno({})
    })
}

export default General;

Object.defineProperty(window, 'socket', {
    value: nSocket,
    enumerable: false, // Esta propiedad hace que no se muestre en console.log(window)
    writable: true, // Permite modificar el valor de la variable
    configurable: true // Permite eliminar o modificar la definición de la propiedad
});