import React from "./MiReact.js"
import { buffer } from "../vistas/bin/env.js"
import $ from "./$.js"
import Dialogo from "../tools/Dialogo.js"
import {infMensaje} from '../interfaces/JappN.js'
import {notiWait} from '../vistas/bin/env.js'

/**
 * 7/11/2025 Refactorización de funciones basicas y migración de alCargar a React
 */


export default class JappN{
    useVID=true
    protected version:string="0.11.2"
    protected Us
    protected UsRol
    protected id:string='' //identificador unico por defecto vacio
    protected nodos:any[]=[]
    protected bin:any=undefined     //contexto remoto
    protected el:HTMLElement|HTMLElement[]|string|any
    protected estado:string="Inicializando"
    protected notificado:number=0  //miliseundos de bloqueo para recibir mas notificaciones
    parent:any=undefined

    private arrEstadoError=["Id duplicado", "Bloqueado"]
    private arrEstadoOk=["Cargado", "Cargando"]

    constructor(...e){
        //React._actual_.push(this)
        //console.log(this) 
    }

    $(el){
        return $(el)
    }

    //Pendiente de analizar y definir funcionalidad
    protected comp(name:string){
        for (let i=0;i<this.nodos.length;i++)
            if (this.nodos[i].nombre == name)
                return this.nodos[i]
        
        return undefined
    }

    //pre recibir mensajes de broadcast
    protected _preRecibir(mensaje){
        try{
            if ( this['alRecibir'] != undefined ){
                this['alRecibir'](mensaje)
            }
            this.notificado = notiWait //tiempo de bloqueo despues de ser notificado (env.js)
            console.log(this.notificado)
            const timer = setInterval(()=>{
                this.notificado--
                if (this.notificado==0) clearInterval(timer)
            }, 1)
            return true
        } catch(e){
            return false
        }
    }

    
    protected enviar(mensaje:infMensaje|any){
        if (mensaje['mensaje']==undefined) mensaje['mensaje'] = mensaje

        if (mensaje['destino'] == undefined ) {
            mensaje['destino']="*"
            mensaje['propagacion']=4
        }
        if (mensaje['propagacion'] == undefined ) mensaje['propagacion']=0
        if (mensaje['confirmar'] == undefined) mensaje['confirmar']=false
        
        let retorno=true

        switch(mensaje['propagacion']){
            //hacia un elemento, nombre o #id
            case 0:
                retorno = this.aModulo(mensaje)
            break;
            //hacia la rama
            case 1:
                retorno = this.aRama(mensaje)
            break
            //hacia el tronco
            case 2:
                retorno = this.aTronco(mensaje) 
            break
            //hacia el tronco y rama
            case 3:
                const rama = this.aRama(mensaje)
                const tronco = this.aTronco(mensaje)
                retorno = rama == tronco
            break
            //broadcast
            case 4:
                const root = this.getRoot()
                retorno = this.aRama(mensaje, root) 
            break
        }
        
        return retorno
        
    }

    //function hacia un modulo o modulos que cumplan el mismo criterio
    private aModulo(mensaje:infMensaje, mo:any[]=[]){
        mo=this.findModulo(mensaje.destino)
        let pass:boolean = true

        for(let i=0; i<mo.length; i++){
            pass = pass == this.tryEnviar(mensaje, mo[i])    
        }
            
        return pass
    }

    //notifica hacia la rama, mo es el modulo
    private aRama(mensaje:infMensaje, mo=this){
        let pass:boolean=true

        if ( mo['nodos']!=undefined ){
            for (let i=0; i<mo['nodos'].length;i++){
                const iMo = mo.nodos[i]
                const id = mensaje.destino?.substring(0,1)=="#"?mensaje.destino?.substring(1):undefined
                //si encuentra igualacion en ID, nombre o es destino *
                if ( id == iMo.id || mensaje.destino == iMo.nombre || mensaje.destino == "*"){
                    pass = pass == this.tryEnviar(mensaje, iMo)
                } 
                if ( iMo['nodos'] != undefined){
                    const found = this.aRama(mensaje, iMo)
                    pass = pass == found
                }
            }
        }

        return pass
    }

    //notifica hacia el tronco
    private aTronco(mensaje:infMensaje, mo=this){
        return true
    }

    //accion de intentar enviar el mensaje
    private tryEnviar(mensaje, iMo){
        let pass:boolean=true

        //firmar mensaje
        mensaje['ctxEmisor']=this
        let ok:boolean=true

        if ( iMo['_preRecibir'] != undefined ){
            if ( mensaje['confirmar'] ){
                //espera el resultado de la ejecucion
                ok = iMo['_preRecibir'](mensaje)
                pass = pass == ok 
                if ( this['alMandado'] ) this['alMandado'](mensaje, ok, pass)
            }else{
                //ejecuta sin esperar resultado
                iMo['_preRecibir'](mensaje)
                this['alMandado'](mensaje, true, pass)
            }
        }
        return pass
    }


    protected findModulo(strModulo, mo:any=undefined){
        mo=mo==undefined?this.getRoot():mo
        const pila:any=[]
        //recorrer arbol 
        if ( mo.nodos != undefined){
            for (var i=0; i<mo.nodos.length; i++){
                //si se busca por ID
                const id = strModulo.substring(0,1)=="#"?strModulo.substring(1):undefined
                if ( mo.nodos[i].id == id || mo.nodos[i].nombre == strModulo  ){ //si este es el modulo que busco
                    pila.push(mo.nodos[i])
                }else{                    
                    if ( mo.nodos[i]['nodos'] != undefined ){
                        //crear recursividad
                        const found = this.findModulo(strModulo, mo.nodos[i])
                        //si hay recursividad positiva retorno lo encontrado
                        if ( found.length >0) pila.push(found)
                    }
                }
            }
        }
        return pila
    }

    //Puente para poder aplicar operaciones globales a los componentes antes de cargar
    protected _preCargar(props, contenido?, callBack?){
        //tempo en lo que se reselvue find/modulo
        if (props['id'] != undefined){
            if (props['id'].substring(0,1) == "*"){
                this.estado = 'Id invalido'
                return <span style="font-size:.8rem" class="icon-alert">Error: Id inicia con caracter inválido [ * ].</span>
            } 
            /*
            IMPORTANTE, buscar en donde validar ID duplicado de elementos.
            const existente = this.findModulo(`#${props['id']}`)
            if (existente.length > 0){
                this.estado = 'Id duplicado'
                return <span style="font-size:.8rem" class="icon-alert">Error: conflicto con ID, ya existe un componente renderizado desde el módulo con el id [ {props['id']} ] en esta rama.</span>
            }
            */
        }
    
        this.estado = 'cargando'

        /*
        if (props['bin'] != undefined) {
            if (props.bin['nodos'] != undefined) props.bin['nodos'].push(this)
            this.bin = props.bin
        }
        */
        if ( props['id'] != undefined ) this.id = props['id']
        return this.alCargar(props, contenido, callBack)
    }

    protected _preCargado(element, contenido?, callBack?){
        this.el = element
       
       if ( this.arrEstadoError.indexOf(this.estado) == -1 ) this.estado = "Cargado"
       else return

       if (this['alCargado']!=undefined)
            this['alCargado'](element, contenido, callBack)
    }


    //Puente para poder aplicar operaciones globales a los componentes antes de cargar
    protected _preCerrar(props, contenido?, callBack?){
        //evaluar eliminar la referencia a nodos del componente parent y compoennte bin
        //evaluar un evento posCerrar

        return this['alCerrar']!=undefined?this['alCerrar'](props, contenido, callBack):false
    }

    //evento original alCargar (funcion por omision)
    alCargar (props, contenido?, callBack?){
        return <span style="color:red"> !!Este componente está incompleto, requiere una función para el evento alCargar.!!</span>
    }
    
    protected Cargar(vista, cont_callback?, callback_cont?){
        React.Cargar(vista, cont_callback, callback_cont)
    }

    //la funcion que finalmente carga el contenido
    //evaluar deprecate porque ya esta el React
    protected doCargar(cont, vista, fnd=(v)=>{}){
        cont.innerHTML=''
        cont.append(vista)
        if (fnd != undefined) fnd(vista)
    }

    protected setJappFnd(tag, ctx){
        if (ctx == undefined) ctx=this
        //agrega el evnto de validacion de cierre
        if (ctx['alCerrar'] != undefined)
            tag['_alCerrar']=()=>{
                return ctx['alCerrar']()
            }

        //evaluar listeners para keypress 
        if (ctx['_keys'] != undefined)
            tag['_alKeyDown']=(event)=>{
                for(let i=0; i<ctx['_keys'].length; i++){
                    if (ctx['_keys'][i]['ctrl'] == undefined) ctx['_keys'][i]['ctrl']=false 
                    if (ctx['_keys'][i]['alt'] == undefined) ctx['_keys'][i]['alt']=false   
                    const tecla = ctx['_keys'][i]['key']!=undefined?
                        event.key==ctx['_keys'][i]['key']
                        :ctx['_keys'][i]['code']!=undefined?
                            event.code==ctx['_keys'][i]['code']
                            :event.keyCode==ctx['_keys'][i]['keyCode']

                    if ( tecla 
                            && event.ctrlKey == ctx['_keys'][i]['ctrl'] 
                            && event.altKey == ctx['_keys'][i]['alt']
                        ){
                        ctx['_keys'][i]['fnd'](event)
                        event.stopPropagation()
                        event.preventDefault()
                        return false
                    }
                }
            }
        this.setJappAcc(tag)
    }

    protected setJappAcc(tag){
        if (tag instanceof Array == false){
            tag=[tag]
        }
        
        
        for (let l=0; l<tag.length;l++){
            const colaps = tag[l].querySelectorAll('.jap_colap')
            for(let i=0; i<colaps.length; i++){
                const element = colaps[i]
                element.classList.add("icon-plus")
                element.style.cursor="pointer"
                element.addEventListener("click", (e)=>{
                    const cont=e.target.nextSibling
                    if (e.target.classList.contains("close")){
                        e.target.classList.remove("close")
                        cont.classList.remove('hide')
                    }else{
                        e.target.classList.add("close")
                        cont.classList.add('hide')
                    }
                })
            }
        }

        for(let l=0;l<tag.length;l++){
            const edits = tag[l].querySelectorAll('.jap_edit')
            edits.forEach(el=>{
                const exist = el.nextElementSibling
                let agregado=false
                if (exist==null){
                    el.insertAdjacentElement('afterend',<i class="icon-edit"></i>)
                    agregado=true
                }
                else if (!exist.classList.contains('icon-edit')){
                    el.insertAdjacentElement('afterend',<i class="icon-edit"></i>)
                    agregado=true
                }
            
                if (agregado){
                    el.addEventListener('click', e=>{
                        const original = this.$(el).val()
                        const rect = el.getBoundingClientRect()
                        const input = <input lock="0" type="text" value={original}/>

                        input.style.position="absolute"
                        input.style.top=`${rect.top-7}px`
                        input.style.left=`${rect.left}px`
                        input.style.width=`${rect.width}px`
                        input.style.height=`${rect.height+14}px`
                        document.querySelector('#root')?.append(input)
                        input.select()

                        input.onkeydown=e=>{
                            if (e.key=='Escape'){
                                e.stopPropagation()
                                e.preventDefault()
                                input.setAttribute('lock', 1)
                                this.$(el).val(original)
                                input.remove()
                            }

                            if (e.key=='Enter'){
                                e.stopPropagation()
                                e.preventDefault()
                                input.setAttribute('lock', 1)
                                this.$(el).val(e.target.value)
                                input.remove()
                            }
                        }

                        input.addEventListener('blur', e=>{
                            if (e.target.getAttribute('lock')=="0") this.$(el).val(e.target.value)
                            input.remove()
                        })
                    })
                }
            })
        }
    }

    /** busca todois los campos marcados con la clase _trj en un elemeto */
    protected getCampos(query, clase:string=""){
        const campos = clase==""?$(query).find("._trj"):$(query).find(clase)
        const reg={}
        campos.forEach(el=>reg[el.id]=el.get())
        return reg 

    }

    /**limpia los campos de un formulario/ */
    protected clearCampos(query, clase=""){
        const campos = clase==""?$(query).find("._trj"):$(query).find(clase)
        campos.forEach(el=>{
            if (el.tagName == "DIV") el.querySelector("input").value=""
            else el.value=""
        })
    }

    //manejo de errores
    protected e(data){
        
        if (data.error == undefined){
            alert("El objeto data recibido, no posee un estructura correcta para restComp.");
            return true
        }else if(data.error != ""){
            alert(data.error);
            return true;
        }else{
            return false
        }
        
    }

    //obtiene los elementos DIV dentro de un elemento HTML
    /**pendiente de definir su funcion y validez */
    protected getDivs (contenido, tipo="DIV"){
        let myContent:HTMLElement[] = []
        for (let i=0;i<contenido.length;i++)
          if (contenido[i].tagName == tipo){
            if (tipo != "DIV") contenido[i] = <div>{contenido[i]}</div>
              myContent.push(contenido[i])
          }else {
            if (contenido[i].constructor.name == "Array")
              myContent = myContent.concat(this.getDivs(contenido[i], tipo))
        }
        return myContent
    }

    //devuelve verdadero si la app está ejecutandose en un disositivo movil
    isMobile(){
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }

    protected Dialogo(mensaje:any){
        const dlg = new Dialogo()
        let o
        if (typeof mensaje == 'string') o={mensaje:mensaje}
        else o=mensaje

        const tag = dlg.alCargar(o)

        document.querySelector('#root')?.append(tag)
        this.setJappFnd(tag, dlg)
        dlg.alCargado(tag)
    }

    protected num(cantidad, dec=0){
        const n=Number(cantidad)
        return n.toFixed(dec)
    }

    protected toRes(data){
        if (data.res == undefined && data.oRes == undefined) {
            data.error = "No existe un resultado en este objeto."
        } else {
            if (data.res == undefined){
                data['res']=[]
                for(let i in data.oRes){
                    const item = data.oRes[i]
                    item[data.key] = i
                    data.res.push ( item )
                }
                delete(data.oRes)
            }
        }
        return data;
    }

    //busca el nodo mas alto dentro de una rama de modulos jappN
    protected getRoot(el=this){
        let foco = el
        while (foco['parent'] != undefined){
            foco=foco.parent
        }
        return foco
    }

   protected import(modulePath) {
        return import(modulePath)
        .then(module => {return {error:"", modulo:module}})
        .catch(error => {
            console.error("Error al importar el módulo:", error);
            return {error:"No es posible obtener el módulo "+modulePath}
        });
    }
}

class Dragger {
    container
    draggedElement
    param
    constructor(container,param={}) {
        if (param['fijo']==undefined) param['fijo']=false
        if (param['auto']==undefined) param['auto']=true
        if (param['callBack']==undefined) param['callBack']=(e,ee)=>{}
 
        this.param=param
 
        container.classList.add('draggable')
        if (param['fijo']==0) container.setAttribute('draggable', true)
        if (param['auto']==1) container.classList.add('droppable')
           
        this.container = container;
        this.draggedElement = null;
 
        this.init();
    }
 
    init() {
        this.container.addEventListener('dragstart', this.onDragStart.bind(this));
        this.container.addEventListener('dragover', this.onDragOver.bind(this));
        this.container.addEventListener('drop', this.onDrop.bind(this));
    }
 
    onDragStart(event) {
        this.draggedElement = event.target;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', this.draggedElement.outerHTML);
        this.draggedElement.classList.add('dragging');
        //console.log(event.dataTransfer)
    }
 
    onDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }
 
    onDrop(event) {
        this.draggedElement = document.querySelector(".dragging")
        event.preventDefault();
        event.stopPropagation();
        if (event.target !== this.draggedElement){
            this.param.callBack(this.draggedElement, event.target);
           
        }
   
        if (event.target !== this.draggedElement && event.target.classList.contains('droppable')) {
            event.target.insertAdjacentHTML('beforebegin', event.dataTransfer.getData('text/html'));
            this.draggedElement.remove();
            this.draggedElement = null;
        }
 
        this.draggedElement.classList.remove('dragging');  
    }
}


export {$, Dragger}