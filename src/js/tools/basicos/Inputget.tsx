import React from "../../libs/MiReact.js"
import Elemento from "./Elemento.js"

export default class Inputget extends Elemento{
    endpoint=''
    alCargar(props){
        if (props['endpoint']!=undefined) this.endpoint = props['endpoint']
        return <div class={"_trj _inpGet"+ (props.class==undefined?"":props.class) } id={props.id}>
            <span>{props.etiqueta}</span>
            <input type={props.tipo} value={props.valor} onChange={(e)=>this.setValue(e.target)}/><button class="icon-search"></button>
        </div>
    }

    setValue(e){
        this.value = e.value
    }

    alCargado(el, props){
        el['get']=()=>{
            return this.value
        }
        super._rendered(el, props)
    }
}