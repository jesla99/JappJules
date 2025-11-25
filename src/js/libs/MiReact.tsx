import JappN from "./JappN.js" //se importa no para construirlo, solo para validador de tipo de instancia
import {buffer, vars} from "../vistas/bin/env.js"
import NoPermiso from "../tools/NoPermiso.js"
/*  Progamado por Jesus Laynes Mayo 2024
22/10/2025 David Espinoza: Se agregan los eventos onPaste y onInput 
29/10/2025 Jesus Laynes: Se modifica alHilo por alTirar y se modifica jsx_hilo por jsx_Gancho
29/10/2025 Jesus Laynes: corrección de Bug jsx_  extensiones afectadas
05/11/2025 Jesus Laynes: Se depura, refactoriza y optimiza la clase MiReact, se aprovecha para validar y dejar funcionando _permiso en modulos JappN
06/11/2025 Jesus Laynes: Se agrega la opción de permisos por elemento e incremento de documentación.
07/11/2025 Jesus Laynes: Se programa un garbage colector, se valida y depura el evento alCerrar  
07/11/2025 Jesus Laynes: Migración completa de logica de Carga desde JappN
25/11/2025 Jesus Laynes: Se integra cambio perdido de David Espiniza
*/


class MiReact {
    version= "1.2.4"
    //Us=0
    //UsRol=0
    noPermiso = new NoPermiso()

    public Cargar(vista, cont_callback?, callback_cont?){
        let cont, fnd

        //console.log(document.querySelector(cont_callback))
        //console.log("---",this.querySelector(cont_callback))

        if (typeof cont_callback=="string") cont=this.querySelector(cont_callback)
        if (typeof callback_cont=="string") cont=this.querySelector(callback_cont)
            
        if (typeof cont_callback=="function") fnd=cont_callback
        if (typeof callback_cont=="function") fnd=callback_cont

        if (cont==undefined)cont=document.querySelector("#root")
        //Limpiar cont
        const siSale = React.clearCont(cont, true)
        if (siSale.error==""){
            //React.garbage()
            this.doCargar(cont, vista, fnd)
        }else{
            if (!siSale.oculto) alert(siSale.error)
                else console.log(siSale)
        }
    }

    querySelector(el){
        for(let i=0;i<buffer.length; i++){
            const b=buffer[i]
            const t=b['el']!=undefined?b['el'].querySelector(el):null
            
            if (t!==null?this.estoEs(t):null!==null) return t
        }

        return null
    }

    //la funcion que finalmente carga el contenido
    protected doCargar(cont, vista, fnd=(v)=>{}){
        cont.innerHTML=''
        cont.append(vista)
        if (fnd != undefined) fnd(vista)
    }


    /** Desmontar elementos*/
    //funcion que evalua la limpiueza 
    public clearCont(cont, main=false):any{
        const lista = cont.querySelectorAll('[class^="jcss"]');
        const vKill =[]
        for (let i=lista.length-1;i>-1;i--){
            //obtengo la clase jcss que posee el VID del modulo
            const item = lista[i].className.match(/\bjcss\w*\b/g)

            //obtengo el findVID para buscarlo dentro de buffer
            const fVID = item[0].substring(4)

            for(let b=0;b<buffer.length;b++){
                const laVista = buffer[b]
                if (laVista.VID == fVID){
                    vKill.push(laVista.VID)
                    if (laVista['alCerrar'] != undefined){ 
                        const obCerrar = laVista.alCerrar()
                        if (obCerrar.error != "") {
                            return obCerrar
                        }
                    }
                    break
                }
            } 
        }

        //Recolectar basura
        this.garbage(vKill)

        return {error:""}
    } 


    /**Colector de basura que mantiene Limpio a buffer */
    public garbage(vKill){
        
        for (let i = buffer.length - 1; i >= 0; i--) {
  
            // Obtenemos el ID del elemento actual
            const d = buffer[i].VID;

            if (vKill.indexOf(d)> -1)
                buffer.splice(i, 1);

        }
  
    }

    //se encarga de fabricar la herencia de un componente tipo jappN
    public mkDrv(jsxClass, props={}){
 
        if (props==null)props ={}
        const drv = this.estoEs(jsxClass) == "class"?new jsxClass():jsxClass

        if (drv.useVID) drv.VID=vars.PVID++
        drv["id"]=props['id']!=undefined?props['id']:"jcss"+drv.VID

        //asignación de permisos
        if (props['_Us'] != undefined) drv.Us = parseInt(props['_Us'])
        if (props['_UsRol'] != undefined) drv.UsRol = parseInt(props['_UsRol'])

        drv.nombre = jsxClass.name
        drv['_props']=props
       
        //if(jsxClass.name!=undefined && drv instanceof JappN){
        if(jsxClass.name!=undefined){
            if (buffer.length > 0){
                const padre = buffer[buffer.length-1]
               
                drv.parent = padre
                if (padre.nodos != undefined) padre.nodos.push(drv)
 
            }
            if (props['bin'] != undefined && drv.parent == undefined)
                drv.parent=props['bin']
       
            //drv['core']=this
            //jesus
            buffer.push(drv)
        }

        if (drv['_permiso']!=undefined){
            let permiso=false
            if (drv._permiso['rol']!=undefined){
                if (drv._permiso.rol.indexOf(drv.UsRol) > -1) permiso=true
            }
            if (drv._permiso['usuario']!=undefined){
                if (drv._permiso.usuario.indexOf(drv.Us) > -1) permiso=true
            }
            if (!permiso){
                this.noPermiso.tipo=drv._permiso['tipo']==undefined?0:drv._permiso['tipo']
                return this.noPermiso
            }
        }
 
        return drv
    }


    public readonly estoEs=(func:any)=>{
        if (typeof func === 'function') {
            if (/^class\s/.test(Function.prototype.toString.call(func))) return 'class';
            else return 'function';
        }
    
        if ( func.tagName != undefined ) return func.tagName
        if (typeof func == 'object' && func instanceof JappN) return "jappObj"
        return typeof func;
    }
/*
    protected jsx=(clase, props={}, ...hijos)=>{
        return this.createElement(clase, props, ...hijos)
    }
        */
    
//testing
    renderJappN(jsxClass, props={}, hijos=[]){
        const drv = this.mkDrv(jsxClass, props)
        let tag = drv['_preCargar']!=undefined?drv['_preCargar'](props, hijos):drv.alCargar(props, hijos)
        return [tag, drv]
    }

    renderFunction(jsxFunction, props={}){
        let tag = jsxFunction(props)
        return tag
    }

    renderEstilo(drv, tag){
        const sheet = <style></style>
        
        for (const i in drv['_estilo']){
            let selector = i
            
            if (drv.useVID){
                const p = selector.split("_")
                if (drv.VID != p[p.length-1]){
                    //selector += "_"+drv.VID
                    selector = ".jcss"+drv.VID+" "+selector
                }
            }
            //reglas
            const reglas = typeof drv['_estilo'][i]=="string"?drv['_estilo'][i]:drv['_estilo'][i].join(";")
            sheet.append(selector+"{"+ reglas +"}")
        }
        tag.append(sheet)
    }


    createElement<Node>(jsx: any, props?: any, ...children: any[]): any { 
        let ret, tag,VID;
        let ifdrv //posible drv para eventos

        ret = document.createElement("div")
        ret.innerHTML = "Error al cargar el Módulo"
           
        if (props===null) props={}
        if (props==undefined) props={}

        //Si es una cadena de texto con el nombre de una etiqueta HTML
        if (typeof jsx == "string"){
            let permiso=true
            let mensaje=""

            if (props['_permiso'] != undefined) {
                permiso=false
                const papa = buffer[buffer.length-1]
                if (props['_permiso']['rol']!=undefined){
                    if (props['_permiso']['rol'].indexOf(papa.UsRol) > -1) permiso=true
                }
                if( props['_permiso']['usuario']!=undefined){
                    if (props['_permiso'].usuario.indexOf(papa.Us) > -1) permiso=true
                }
                this.noPermiso.tipo=props['_permiso']['tipo']==undefined?3:props['_permiso']['tipo']
                mensaje = props['_permiso']['mensaje']??""
                delete props['_permiso']
            }

            if (!permiso){
                tag = this.noPermiso.alCargar({mensaje:mensaje})
            }else{
                tag = document.createElement(jsx)

//renderiza acciones de extension jsx_ En evaluación
this.jsxAccion(tag, props, buffer[buffer.length-1])


                //Cargamos recursivamente el contenido del elmento si no es un componente Japp
                if (arguments[2] != null){
                    for (let i = 2; i < arguments.length; i++) {
                        let child = arguments[i];
    
                        if ( child instanceof Array){
                            child.map((x:any) => tag.append(x));
                        } else {
                            if (typeof child == 'string') tag.insertAdjacentHTML('beforeend', child);
                            else if (child != undefined) tag.appendChild(child.nodeType == null ? document.createTextNode(child.toString()) : child);
                        }
                    }
                }
            }
        }

        //Si es una función (componente funcional)
        if (this.estoEs(jsx) == 'function'){
            tag = this.renderFunction(jsx, props)
        }

        //Si es una clase (componente basado en clase)
        else if (this.estoEs(jsx) == 'class'){
            const elementos = this.renderJappN(jsx, props, children)
            
            tag = elementos[0]
            const drv = elementos[1]

            
            ifdrv=drv
            VID = elementos[2]??undefined

            //Evaluamos ViewID 
            if (drv.useVID && VID == undefined){
                //VID=drv.VID = !drv.VID?(Math.random()*9999).toFixed(0):drv.VID
                VID=drv.VID = !drv.VID?(vars.PVID++):drv.VID
                tag.classList.add("jcss"+drv.VID)
            }

            //evaluamos la propiedad de estilos
            if (drv['_estilo'] != undefined){
                this.renderEstilo(drv, tag)
            }

            //evaluar alCargado
            if (drv['_preCargado']!=undefined){
                drv['_preCargado'](tag,props)
            }else if (drv['alCargado']!=undefined){
                drv['alCargado'](tag,props)
            }
            
        }

        //evaluamos propiedades HTML
        this.setPropiedades(tag, props, ifdrv)
        //evaluamos jcss
        if (props['jcss'] != undefined){
            this.transCss(props['jcss'], props.id||("jcss"+(Math.random()*999).toFixed(0)), tag)
        }
        
        /*test migrar a otro lugar
        //renderiza acciones de extension jsx_ 
        this.jsxAccion(tag, props, ifdrv??this) 
        */

        if (tag != undefined) ret = tag
        return ret
    }  


    //Agrega las propiedades a los elementos HTML generados desde JSX
    private setPropiedades(element, props, drv=undefined){
        
        for (let name in props) {
            switch (name) {
                case 'onBlur': element.onblur = (e:any) => props[name](e); break
                case 'onKeyDown': element.onkeydown = (e:any) => props[name](e); break
                case 'onLoad': props[name](element); break
                case 'onMouseUp': element.onmouseup = (e:any) => props[name](e); break
                case 'onMouseMove': element.onmousemove = (e:any) => props[name](e); break
                case 'onMouseOver': element.onmouseover = (e:any) => props[name](e); break
                case 'onMouseOut': element.onmouseout = (e:any) => props[name](e); break
                case 'onTouchStart': element.ontouchstart = (e:any) => props[name](e); break
                case 'onTouchMove': element.ontouchmove = (e:any) => props[name](e); break
                case 'onTouchEnd': element.ontouchend = (e:any) => props[name](e); break
                case 'onDragEnter': element.ondragenter = (e:any) => props[name](e); break
                case 'onDragLeave': element.ondragleave = (e:any) => props[name](e); break
                case 'onChange': element.onchange = (e:any) =>props[name](e); break
                case 'onDrop': element.ondrop = (e:any) => props[name](e); break
                case 'onDragEnd': element.ondragend = (e:any) => props[name](e, drv); break
                case 'onDragStart': element.ondragstart = (e:any) => props[name](e); break
                case 'onDrag': element.ondrag = (e:any) => props[name](e); break
                case 'onClick':
                case 'onDClick':
                    element.style.cursor="pointer"
                    var p1:any=[0,0],p2:any=[0,0];
                    if (name == 'onDClick'){
                         //prevenimos click al momento de a¿hacer drag
                         element.onmousedown = (e:any)=> {
                            if (e.type == 'touchstart') {
                                p1 = [e.touches[0].clientX, e.touches[0].clientX]
                              } else {
                                p1 = [e.clientX, e.clientY]
                              }
                        }

                        element.onmouseup = (e:any)=> {
                            if (e.type == 'touchsend') {
                                p2 = [e.touches[0].clientX, e.touches[0].clientX]
                              } else {
                                p2 = [e.clientX, e.clientY]
                              }
                        }
                    }

                    element.onclick = (e:any) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const b = e.target;
                        const click = b.getAttribute('click') ? true : false;
                        const lock = b.getAttribute('lock') ? b.getAttribute('lock') : false;
                        if (b.onclick == null && !click) return; //evita el click en objetos que no tienen evento click
                        if (lock) return; //evita el click en objetos que no tienen evento click
                        const especial = (b.classList.contains('fullScreen') || b.classList.contains('dialogo'));

                        if ( p1[0]!=p2[0] || p1[1]!=p1[1]){
                            console.log("Click bloqueado por DClick");
                            return;
                        }

                        if (b.classList.contains('bloqueado')) {
                            console.log("Prohibido el doble click");
                            return;
                        } else if (!especial) {
                            b.classList.add('bloqueado');
                            b.style.enabled = false;
                            setTimeout(() => {
                                const t = props[name](e);
                                b.style.enabled = true;
                                b.classList.remove('bloqueado');
                            }, 200);
                        } else {
                            props[name](e);
                        }
                    }
                    
                    break
                case 'onKeyUp': element.onkeyup = props[name]; break
                case 'onKeyPress': element.onkeypress = props[name]; break
                case 'onInput': element.oninput = props[name]; break
                case 'onPaste': element.onpaste = props[name]; break
                default:
                    if (name && props.hasOwnProperty(name)) {
                        let value = props[name];
                        if (value === true) {
                            element.setAttribute(name, name);
                        } else if (value !== false && value != null) {
                            element.setAttribute(name, value.toString());
                        }
                    }
                break
            }
        }
    }

    jsxAccion(tag, props, drv:any){
        //prefijo para eventos jsx (extensiones para jsx de carga dinamica)
        if (props['class'] && props['class'].indexOf('jsx_') != -1) {
            this.doExtension(tag, props, drv, props['class'].split(" "))
        }
    }

    doExtension(tag, props, drv, list){
        for (let i=0;i<list.length; i++){
            const cl = list[i]
            if (cl.substring(0,4) == 'jsx_'){
                const ext = cl.substring(4)
                try{
                    import(`./react_exts/${ext}.js`)
                    .then(modulo => {
                        const plug = new modulo.default(tag, props, drv)
                    })
                    .catch(error => {
                        console.error('Error al importar el módulo:', error);
                    });
                }catch(e){
                    console.log(e)
                }
            }
        }
    }

    //compara dos objetos
    obCompare(ob1, ob2){
        const key1 = Object.keys(ob1)
        const key2 = Object.keys(ob2)
        if (key1.length != key2.length) return false

        for(let i in ob1){
            if (ob1[i] != ob2[i]) return false
        }
        return true 
    }

    //opcion para cargar css de forma dinamica
    async transCss(file, pref, tag){
        const data = (await fetch("js/vistas/bin/"+file))
        const raw = await data.text()
        const estilo = document.createElement("style")
        const listo = this.mkCssBase(raw, pref)
        estilo.textContent = listo
        tag.classList.add(pref)
        tag.append(estilo)
    }

    mkCssBase(raw, pref){
        const clean = raw.replace(/\/\[\s\S]?\*\//g, '').replace(/\s+/g, ' ').replace(/\}/g, '\}\n')
        const base = clean.trim().split('\n ')
        
        return this.addPrefijo(base, pref)
    }

    addPrefijo(base, pref ){
        let x=""
        for (let i=0; i<base.length; i++){
            let linea = base[i]

            switch (linea[0]){
                case '@':
                    let chunk =linea
                    while(linea[0]!= '}'){
                        i++
                        linea = base[i]
                        chunk += " "+ linea + " ";
                    }
                    const ini =chunk.indexOf('{')+2
                    const media = chunk.substring(ini, chunk.length-1)
                    chunk = chunk.substring(0, ini) + this.mkCssBase(media, "."+pref)  +" } " 
                    x+=chunk
                break
                case ':': x+= linea ;break
                case "#":
                case '.': 
                default:
                    x+= "."+pref + ' ' + linea ;break
            }
        }  
        return x
    }
}

const React = new MiReact()
export default React;