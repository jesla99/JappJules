import JappN from "../libs/JappN.js"
import React from "../libs/MiReact.js"
import Inicio from "../vistas/Inicio.js"

export default class NoPermiso extends JappN{
    tipo=0
    alCargar(props){
        if (props!=undefined && props['tipo']!=undefined){
            this['tipo']=props['tipo']
        }   
        switch(this['tipo']){
            case 0:
                return <div style="padding:20px">
                    <h1 style="color:gray">Japp-N</h1>
                    <h2 class="icon-warning" style="color:darkred">No posee permiso para acceder a este recurso.</h2>
                    <button onClick={()=>this.Cargar(<Inicio />)}>Regresar a pantalla de incio</button>
                </div>
            case 1:
                return <div class="icon-warning">
                    No posee acceso!!
                </div>
            case 2:
                return <div style="font-size:1rem;color:darkred" class="icon-warning">
                    No posee acceso!!
                </div>
            case 3:
                return <span></span>
            case 4:
                return <div style="font-size:1rem;color:darkred" class="icon-warning">
                    {props.mensaje}
                </div>
        }
    }
}