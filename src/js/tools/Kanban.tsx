import React from '../libs/MiReact.js'
import JappN from '../libs/JappN.js'

/**
 * Parametros:
 * id: identificador del elemento renderizado
 * nwTask: valor boleano que indetifica si se pueden agregar o no tareas de forma dinamica
 * callBack: función de retorno 
 * 
 * NOTA: Al finalizar el arrastre de un elemento de una columana a otra, si el elemento arrastrado pose un gancho
 * el gancho es tirado y se envia (idColumna, ?Columna, ?contenedor de columna)
 * 
 * 13/11/2025 Jesus Laynes se programa el hook (tirar) para contenido con gancho contruido.
 * 13/11/2025 Jesus Laynes agrega funcionalidad de colapsar columnas
 * 
 * 
*/

export default class Kanban extends JappN{
    version="1.3"
    itemArrastrado:any = null;
    ordenar = false
    props={}
    contador=0
    kColap:boolean=false
    readOnly:boolean=false

    alCargar(props, cont){
        this.readOnly = props['readOnly']??false
        this.props=props
        if (this.props["callBack"] == undefined) this.props["callBack"] = (...e)=>{}

        if (props['kColap']) this.kColap=props['kColap']

        return <div class="_kanban" id={props['id']}>
            {cont.map(c=><div data-index={this.contador++} data-id={c.getAttribute('data-id')??""}>
                <div class="jsx_Colap" callBack={(e)=>this.colap(e)}>{c.getAttribute('nombre')} {this.props['nwTask']?(<i onClick={e=>this.props['callBack'](e.target.parentNode.nextSibling, "nuevo")} style="position:absolute;right:-2px;top:5px" class="icon-plus-circled-1" >&nbsp;&nbsp;</i>):""}</div>
                <div class="_kcont">
                    {[...c.children].map(i=>{
                        i.classList.add('_kdrag')
                        i.setAttribute("col", c.getAttribute("nombre"))
                        return i
                    })}
                </div>
            </div>)}
        </div>
    }

    alCargado(el){
        el['addCol'] = nombre=>{
            const cont = <div class="_kcont"></div>
            el.append(<div><div>{nombre} {this.props['nwTask']?(<i onClick={e=>this.props['callBack'](e.target.parentNode.nextSibling, "nuevo")}>&nbsp;&nbsp;+</i>):""}</div>{cont}</div>);
            this.addColEvent(cont)
        }

        setTimeout(()=>{
            const items = el.querySelectorAll('._kdrag');
            const contenedores = el.querySelectorAll('._kcont');

            // Eventos para los items
            items.forEach((item:any) => {
                this.addTaskEvent(item)
            });

            // Eventos para los contenedores
            contenedores.forEach(contenedor => {
               this.addColEvent(contenedor)
            });
        },500) 
    }

    addTaskEvent(item){
        if(this.readOnly) return
        item.setAttribute('draggable', true);

        item.addEventListener('dragstart', (e) => {
            this.itemArrastrado = e.target;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', item.innerHTML);
            item.classList.add('arrastrando');
        });

        item.addEventListener('drop', (e)=>this.ordenar=true)

        item.addEventListener('dragend', (e) => {
            this.itemArrastrado = null;
            item.classList.remove('arrastrando');
        });
    }


    addColEvent(cont){
        cont.addEventListener('dragover', (e:any) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        cont['addTask']=item=>{this.addTaskEvent(item);cont.append(item)}
        cont.addEventListener('drop', (e:any) => {
            e.preventDefault();
            if (this.itemArrastrado) {
                const col=e.target.parentNode.getAttribute("data-index")
                if (this.itemArrastrado.tirar !=undefined) 
                    this.itemArrastrado.tirar(col, e.target.parentNode, e.target)

                // Reordenar items dentro del mismo contenedor
                const itemsEnContenedor = Array.from(cont.querySelectorAll('._kdrag'));
                const itemArrastradoIndex = itemsEnContenedor.indexOf(this.itemArrastrado);
                const itemSoltadoIndex = itemsEnContenedor.indexOf(e.target);

                if (itemSoltadoIndex !== -1 && itemArrastradoIndex !== itemSoltadoIndex) {
                    if (itemArrastradoIndex < itemSoltadoIndex) {
                        cont.insertBefore(this.itemArrastrado, e.target.nextSibling);
                    } else {
                        cont.insertBefore(this.itemArrastrado, e.target);
                    }
                }
                
                if (!this.ordenar){
                    // Mover item a otro contenedor
                    cont.appendChild(this.itemArrastrado);
                    const nnombre = cont.parentNode.children[0].innerText
                    this.itemArrastrado.setAttribute("col", nnombre)
                }
                this.ordenar=false
                
            }

        });
    }

    colap(e){
        if (this.kColap){
            if (e.target.classList.contains("close")){
                e.target.parentNode.classList.remove('_kanColap')
            }else{
                e.target.parentNode.classList.add('_kanColap')
            }
        }
    }
}