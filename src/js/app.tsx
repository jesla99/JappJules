import WebParam from './libs/WebParam.js' //obtiene parametros recibidos en la url
import General, {setDB, setTabla} from './libs/General.js'
import React from './libs/MiReact.js'
import Rest from './libs/Rest.js'
import dsn, {dbInit} from './vistas/bin/dsn.js'
import Config from './Config.js'
import appConfig from './vistas/bin/env.js'


document.title = appConfig['nombre']==undefined?Config.nombre:appConfig['nombre']

//Cargar funciones generales
General();

declare global {var React:any}
declare global {var Rest:any}
globalThis.React = React
globalThis.Rest = Rest

//Creación/apertura de base de datos.
let msgDB:any = await setDB(dsn)
if ( msgDB['new'] ) 
    for (let i=0; i<dbInit.length; i++){
        await setTabla(dbInit[i].store, dbInit[i].data)
    }   
/*
.then((data:any)=>{
    //si la base de datos esta recien creada
    if (data.new){
        for (let i=0; i<dbInit.length; i++){
            setTabla(dbInit[i].store, dbInit[i].data)
        }   
    }
})
*/

//analizar si es pagina HTML
const params = WebParam()
if (params['_v'] != undefined){
    import(`./vistas/${params['_v']}.js`)
    .then(modulo => {
        const tag = React.createElement(modulo.default, params)
       if (tag instanceof Array)  document.querySelector("#root")?.append(...tag)
       else document.querySelector("#root")?.append(tag)
    })
    .catch(error => {
        console.error('Error al importar el módulo:', error);
    });
    //
} else {
    import(`./vistas/Inicio.js`)
    .then(modulo => {
        const tag = React.createElement(modulo.default, params)
       if (tag instanceof Array)  document.querySelector("#root")?.append(...tag)
       else document.querySelector("#root")?.append(tag)
    })
    .catch(error => {
        console.error('Error al importar el módulo:', error);
    });

}