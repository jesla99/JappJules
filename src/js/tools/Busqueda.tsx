import React from "../libs/MiReact.js";
import JappN from "../libs/JappN.js";

export default class Busqueda extends JappN{
    alCargar(props){
        let estilo=""
        if (props['ancho'] != undefined) estilo+='width:'+props.ancho+';'

        return <div class="t_busqueda" style={estilo}>
            <input type="text" placeholder={props.placeholder} /><button class="icon-search"></button>
        </div>
    }

    aboute(){
        console.log("SOY ABOUT DE BUSCAR")
    }
}