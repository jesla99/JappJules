import React from "../../libs/MiReact.js"
import Elemento from "./Elemento.js"

export default class Texto extends Elemento{
    alCargar(props){
        return <div class={"_trj "+ (props.class==undefined?"":props.class) } id={props.id}>
            <span>{props.etiqueta}</span>
            <textarea onChange={(e)=>this.setValue(e.target)}>{props.valor}</textarea>
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