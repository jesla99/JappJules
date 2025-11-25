import React from "../../libs/MiReact.js"
import Elemento from "./Elemento.js"

export default class Input extends Elemento{
    alCargar(props){
        console.log(props)
        return <div class={"_trj "+ (props.class==undefined?"":props.class) } id={props.id}>
            <span>{props.etiqueta}</span>
            <input type={props.tipo} placeholder={props['placeHolder']} value={props.valor} onChange={(e)=>this.setValue(e.target)}/>
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