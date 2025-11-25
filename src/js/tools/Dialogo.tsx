import React from "../libs/MiReact.js";
import {Dragger} from "../libs/JappN.js";
import {preload} from "../vistas/bin/env.js"
 
/**
 * Programdo por; Jesus Laynes
 * 23-10-2025 Jesus: Se agrega la opción de recibir contexto en bin y de existir se devuelve como 3er parametro de callBack (el, ?boton, ?bin)
 * 12/11/2025 Jesus: Se modifica la opcion de destruir el dialogo, no consideraba eliminar los elementos de la cache y se saltaba el garbage collecctor
 */



interface JDialogoMsj{
    vprops:any  //propiedaes para el módulo que pueda ser cargado como mensaje
    botones:any  //objeto con nombres de boton y como valor, el retorno para la funcion con el mismo nombre en modulo ejecutor
}
 
export default class Dialogo{
    useVID=true
    version:"1.2.4"
    el
    callBack=undefined
    _keys=[
        {code:"Escape", fnd:(e)=>this.cerrar()}
    ]
    flag=undefined
    mCtx=undefined
    bin=undefined //referencia al contexto externo (origen de invocación)
 
   alCargar(props){

        let botones:any[]=[]
        let btClass=''
        if (props['callBack'] != undefined) this.callBack=props['callBack']
        if (props['bin'] != undefined) this.bin=props['bin']
        
        if(props['vprops']==undefined)props['vprops']={}
        //const ctx:any= typeof props['mensaje'] == 'object'?props['mensaje']:(props['bin']!=undefined?props['bin']:undefined)
 
        //mensaje como contexto
        //Quiza se deba evaluar jappFnd y jappAcctions
        //mCtx es el contexto del módulo si el mensaje es un modulo
        this.mCtx=React.estoEs(props.mensaje)=="class"?React.mkDrv(props.mensaje, props['vprops']):undefined
 
        //Seteamos el contexto al contexto recibido o en su defecto si recibimos un objeto, ese sera el contexto, si es un mensaje normal, se ignora el contexto
        const ctx:any= props['bin']!=undefined?props['bin']:(this.mCtx!=undefined?this.mCtx:undefined)
        //Si hay botones
        if(props['botones'] != undefined){
            //recorrer botones y setear acciones
            for(let i in props['botones']){
                //agregar el boton a la botonera
                botones.push(<button class={props['botones'][i]['class']??""}  onClick={(e)=>{
                    this.flag = props['botones'][i]
                    //oculta la botonera
                    e.target.parentNode.style.display='none'
                    //agrega un preload a la botonera para indicar que esta trabajando
                    this.el.querySelector('._log_').innerHTML='<img src="'+ (preload==""?'css/preload.gif':preload) +'">'
 
                    //si el boton tiene una funcion como flag
                    if (React.estoEs(props['botones'][i]) == "function"){
                        props['botones'][i](e)
                        this.cerrar()
                    }else if ( props['botones'][i]['fnd'] != undefined ){ // si el boton tiene su propia función como objeto
                        //si el boton posee su propia funcion
                        props['botones'][i]['fnd'](e)
                        this.cerrar()
                    }else{ //si se buscará una función local del lado de quien invoca al Dialogo, es necesario traer una referencia bin o ctx
                        if (ctx==undefined) this.regresar(e,props, {error:''}) //si no trae contexto usara la funcion local de Dialogo regresar
                        else {
                            //Si posee contexto pero el contexto no posee la función relativa al boton usar regresar local de Dialogo
                            if (ctx[i] == undefined) this.regresar(e, props['botones'][i], {error:''})
                            else { //usa la funcion local del contexto relacionada al boton en el invocador del Dialogo
                                const prop = props['botones'][i]
                                //prop['ctx']=this //Devuelve el controlador del dialogo como contexto
                                const resultado = ctx[i](prop) //devuelve las propiedeas del boton por aquello que fuera a un conteto diferente al que lo cargo
                                if (resultado == undefined) this.cerrar()
                                else {
                                    if (resultado['error'] == undefined){
                                        this._alert(e, {error: "Ha ocurrido un error desconocido."})
                                    }else if (resultado['error'] != ""){
                                        this._alert(e, resultado)
                                    }else{
                                        this.cerrar()
                                    }
                                }
                                //analizar respues vacia = todo bien
                                //respuesta como objeto con error, mostrar error
                                //si todo bien cerrar dialogo
                            }
                        }
                    }
 
                }}>
                    {props['botones'][i]['icono']?<i click={true} class={"icon-"+props['botones'][i]['icono']}></i>:""}
                    {props['botones'][i]['nombre']??i
                }</button>)
                btClass="_pie"
            }
        }
 
        const contenido=this.mCtx!=undefined?this.mCtx._preCargar(props.vprops):props.mensaje
        if (this.mCtx!= undefined && this.mCtx['alCargado']!=undefined) this.mCtx['alCargado'](props.vprops, contenido)
 
        return <div class="_screenDialog">
            <div class={"_Dialogo " + (props.win==undefined?'':props.win)+ " " + btClass } style={props['style']!=undefined?props['style']:''}>
                <div>
                    <label>{props.titulo==undefined?'':props.titulo}</label>
                    <button onClick={(e)=>{
                        this.alCerrar(contenido)
                        //cerrando el dialogo
                        const yo = e.target.parentNode.parentNode.parentNode
                        const valClose=React.clearCont(yo)
                        if (valClose.error=="") yo.remove()
                        else alert (valClose.error)
                    }}>Esc</button>
                </div>
                <div class="_c_">
                    {contenido}
                </div>
                {props['botones'] != undefined
                    ?<div class="_pie">
                        <div class="_log_"></div>
                        <div>{botones}</div>
                    </div>
                    :''
                }
            </div>
        </div>
    }
 
    alCargado(el){
        this.el=el
        const mover =  new Dragger(el)
    }
 
    //function generica de retorno que busca callBack
    regresar(e, props, retorno){
        if (retorno.error!=''){
            console.log(retorno)
            this._alert(e, retorno)
            /*
            const alerta = <div style="padding:15px">
                <i class="icon-cancel-circled" onClick={()=>{
                    clearInterval(a)
                    clearInterval(r)
                    this.el.querySelector('._log_').innerHTML=''
                    e.target.parentNode.style.display='inline-block'
                }}> Advertencia: {retorno.error}</i>
                &nbsp;&nbsp;<span class="_clock_">15</span>
            </div>
 
            this.el.querySelector('._log_').innerHTML=""
            this.el.querySelector('._log_').append(alerta)
            const r=setInterval(()=>{
                const t=this.el.querySelector("._clock_")
                t.innerHTML = Number(t.innerHTML)-1
            }, 1000)
           
            const a=setTimeout(()=>{
                clearInterval(r)
                this.el.querySelector('._log_').innerHTML=''
                e.target.parentNode.style.display='inline-block'
            }, 15000)
        }else{
            if (props['callBack'] != undefined) {
                const cb={retorno:retorno,evento:e,contenido:this.el.querySelector('._c_')}
                props['callBack'](cb)
                this.cerrar()
            }else{
                this.cerrar()
            }
        */
        }else{
            this.cerrar()
        }
    }
 
    _alert(e, retorno){
        const alerta = <div style="padding:15px">
                <i class="icon-cancel-circled" onClick={()=>{
                    clearInterval(a)
                    clearInterval(r)
                    this.el.querySelector('._log_').innerHTML=''
                    e.target.parentNode.style.display='inline-block'
                }}> Advertencia: {retorno.error}</i>
                &nbsp;&nbsp;<span class="_clock_">15</span>
            </div>
 
            this.el.querySelector('._log_').innerHTML=""
            this.el.querySelector('._log_').append(alerta)
            const r=setInterval(()=>{
                const t=this.el.querySelector("._clock_")
                t.innerHTML = Number(t.innerHTML)-1
            }, 1000)
           
            const a=setTimeout(()=>{
                clearInterval(r)
                this.el.querySelector('._log_').innerHTML=''
                e.target.parentNode.style.display='inline-block'
            }, 15000)
    }
 
    alCerrar(data=undefined,callBack=undefined){
        if (this.mCtx != undefined) {
            if ( this.mCtx['alSerializar'] != undefined){
                data = this.mCtx['alSerializar']()
            }
        }
 
        if (callBack!=undefined) callBack(data, this.flag, this.bin)
        if (this.callBack != undefined) this.callBack(data, this.flag, this.bin)
    }
 
    cerrar(){
        //console.log("cerrando")
        //this.el.remove()
        const dialogos = document.querySelectorAll("._Dialogo")
        dialogos[dialogos.length-1].querySelector("button").click()
    }
 
}