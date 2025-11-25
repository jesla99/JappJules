//@ts-ignore
import { NodeList } from 'node';

class F${
    $(consulta){
        const els:NodeList = typeof consulta=='string'?document.querySelectorAll(consulta):[consulta]
        if (els.length == 0) return false;

        els.__proto__.parent = function(){
            return [this[0].parentNode]
        }

        //agrega contenido a un elemento
        els.__proto__.append = function(valor:any, callBack?:Function){
            if (typeof valor == 'object' && valor.length != 'undefined'){
                //valor.forEach(item=>this[0].append(item))
                valor.forEach(item=>{
                    this[0].append(item)
                    if (callBack != undefined) callBack(item)
                })
            }
            else{
                this[0].append(valor)
                if (callBack != undefined) callBack(valor)
            }
        }

        //agrega un contenido antes del elemento seleccionado
        els.__proto__.antes = function(valor:any){
            this[0].parentNode.insertBefore(valor, this[0])
        }
        //Agrega un elemento como hermano
        els.__proto__.hermano = function(valor:any){
            this[0].insertAdjacentElement('afterend', valor)
        }

        //selecciona un elemento en particular
        els.__proto__.eq=function(i:number){ 
            if(this.length > 0){
                if (i < 0 ) {
                    const p =this.length + i
                    return this.$(this[p])
                }else return this.$(this[i])
            }else {
                console.log("Contenedor vacío")
                return []
            }
        }

        //busca todos los elementos internos
        els.__proto__.find = function(el:string|Function){ 
            if (typeof el == 'string' )
                return Array.from(this[0].querySelectorAll(el))
            else if(typeof el == 'function'){
                for (let i = 0; i < this.length; i++) {
                    if (el(this[i])) {
                    return this[i];
                    }
                } 
            }
        }

        //busca el contenedor padre segun query selector
        els.__proto__.getPadre = function(query:string){ 
            const prefijo = query.substring(0,1)
            const valor = (prefijo=="."||prefijo=="#")?query.substring(1):query

            let pass=false
            let found=this[0]
            do{
                if (prefijo == ".") pass = found.classList.contains(valor)
                else if (prefijo == "#") pass = found.id == valor
                else pass = found.tagName == valor.toUpperCase()
                if (!pass) found=found.parentNode
                else return found
                if (this.tagName == "BODY") return false
                
            }while(!pass)
            

        }


        //sin argumentos obtiene el valor de un elemento
        // con argumento setea el valor, si es texto o numero o un JSX
        els.__proto__.val= function(valor:any=undefined, callBack?:Function){
            if ( valor == undefined) {
                if (this[0].tagName == 'INPUT' || this[0].tagName == 'SELECT' || this[0].tagName=="TEXTAREA")
                    return this[0].value
                else 
                    return this[0].innerText;
            }else{
                if (this[0].tagName == 'INPUT' || this[0].tagName == 'SELECT' || this[0].tagName=="TEXTAREA")
                    this[0].value=valor
                else{
                    if (typeof valor == "string" || typeof valor == "number") this[0].innerText=valor
                    else this[0].innerHTML = valor
                }
            }
            
            return this[0]
        }

        //obtienen el text de un select
        els.__proto__.text= function(){
            const selectedOption = this[0].querySelectorAll("option")[this[0].selectedIndex]
            return selectedOption.text
        }
        
        //agrega y elimina class de css acepta varias clases separadas por espacio
        els.__proto__.addClass = function(clase:string){return this.class(clase, 1)}
        els.__proto__.removeClass = function(clase:string){return this.class(clase, 0)}
        els.__proto__.class = function(clase:string, tipo:number){
            const cls = clase.split(" ")

            this.forEach((item:Element)=>{
                cls.forEach((cl:string)=>{
                    if (tipo==1) item.classList.add(cl)
                    else item.classList.remove(cl)
                })
            })
        }
        els.__proto__.preAddClass = function(clase:string, tipo:number){
            const cls = clase.split(" ")

            for (let i=0;i<this.length; i++){
                const clases =this[i].className.split(" ")
                for(let c=0; c<cls.length;c++)
                    clases.unshift(cls[0])
                
                this[i].className=clases.join(" ")
            }
        }

        //consulta su existe la clase en el eleento
        els.__proto__.hasClass = function (clase:string|string[]){
            let retorno=false
            const aClase = typeof clase == 'string'?[clase]:clase

            for(let i=0;i<aClase.length;i++){
                if ( this[0].classList.contains(aClase[i])) 
                    return true
            }

            return false
        }

        //agrega o quita una clase (si existe la quita y si no existe la coloca) acepta varias clases separadas por espacio
        els.__proto__.toggleClass = function(clase:string){
            const cls = clase.split(" ")

            this.forEach((item:Node)=>{
                cls.forEach((cl:string)=>{
                    if ( this.$(item).hasClass(cl) ) this.$(item).removeClass(cl);
                    else this.$(item).addClass(cl);
                })
            })
        }

        els.__proto__.css = function(attr:string|any, valor:string|undefined=undefined){
            this.forEach((item:HTMLElement)=>{
                if (valor!=undefined) item.style[attr]=valor
            })
        }

        els.__proto__.print=function(info:any={}){
            const el = this[0]
            const page = document.createElement("DIV")
            page.style.padding="30px"
            const titulo = document.createElement("H1")
            const pie =  document.createElement("DIV")
            let cuerpo:any
            let style=document.createElement("STYLE");

            style.innerText = `*{font-family:Arial}table{width:100%}td{border-bottom:1px gray dashed}.c{text-align:center}.i{text-align:left}.d{text-align:right}`

            titulo.innerText = info.titulo == undefined?'':info.titulo
            pie.innerText = info.pie == undefined?'':info.pie

            if (el.tagName=="TABLE"){
                cuerpo = el.cloneNode(true);
                //pedndiente if (this.$(el).find('label').length > 0 )  desQuebrar(cuerpo)
            }

            page.appendChild(style)
            if (titulo.innerText != '') page.appendChild(page.appendChild(titulo))
            if (cuerpo != undefined) page.appendChild(cuerpo)
            if (pie.innerText != '') page.appendChild(page.appendChild(pie))

            const p=window.open('')
            if(p !== null){
                p.document.body.appendChild(page)
                setTimeout(()=>p.print(), 10)
            }
            
        }

        els.__proto__.tabla=function(){
            const tb = this[0];
            if (tb.tagName == 'TABLE'){
                // Crea una instancia de ResizeObserver
                const observador = new ResizeObserver(entries => {
                    // Por cada entrada observada, muestra el nuevo tamaño en la consola
                    entries.forEach(entry => {
                        const ancho = entry.contentRect.width;
                        const quiebre = tb.getAttribute('data-quebrar')!=null?Number(tb.getAttribute('data-quebrar')):800

                        if (entry.target == tb){
                            //si esta abajo de quiebre
                            const title = tb.rows[0]
                            if (ancho < quiebre && quiebre!=0){
                                if (!tb.classList.contains('tbBreak')) {
                                    tb.classList.add('tbBreak')
                                    //quebrar
                                    for(let i=1;i<tb.rows.length;i++)
                                        for(let c=0;c<tb.rows[i].cells.length;c++){
                                            const celda =tb.rows[i].cells[c].innerHTML
                                            tb.rows[i].cells[c].innerHTML = '<span>'+ title.cells[c].innerHTML +'</span>' + celda 
                                        }
                                }
                            }else{ //si esta arriba de quiebre
                                if (tb.classList.contains('tbBreak')){
                                    tb.classList.remove('tbBreak')
                                    
                                    //pedndiente desQuebrar(tb)
                                    
                                }
                            }
                        }
                    });
                });

                // Observa el elemento
                observador.observe(tb);
            }
        }

        // busca un elemento o elementos de un contenedor simpre que sean hijos inmediatos
        // por lo regular para buscar todos los elementos con una clase
        // o todos los elementos del mismo tag
        els.__proto__.hijos=function(query:string){
            const hijos:any[] =this[0].childNodes
            if (query == "*") return hijos
            const retorno:HTMLElement[]=[]
            for(let h=0; h<hijos.length;h++){
                const i = hijos[h]
                if (query.substring(0,1) == "."){
                    if (i.tagName != undefined)
                        if ( i.classList.contains(query.substring(1)) )
                            retorno.push(i)
                } else if(query.substring(0,1) == "#"){ 
                    if (i['id'] == query.substring(1))
                        retorno.push(i)
                }else{
                    if (i.tagName == query.toUpperCase())
                        retorno.push(i)
                }
            }
            return retorno
        }

        els.__proto__.replace=function(nuevo){
            const contenedor = els[0].parentNode
            contenedor.replaceChild(nuevo, els[0])
        }

        return els;
    }
}



const fnd = new F$()

export default fnd.$