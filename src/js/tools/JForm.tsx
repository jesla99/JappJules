import React from "../libs/MiReact.js"
import Rest from "../libs/Rest.js"
import JTabs from "./JTabs.js"
import Input from "./basicos/Input.js"


import {JitemFrm, JformParam} from "../interfaces/JForm.js"

import JappN from "../libs/JappN.js"

class JForm extends JappN{
    rest=new Rest()
    local:boolean|number=1
    titulo:string
    campos:JitemFrm[]
    tabla:string   //nombre de la tabla o almacen
    reg={}
    full
    frmtab
    botones=['Aceptar']
    vfrm
    key
    vtabla
    tipo     //0=si se recibe llave primaria se asume edición.
    readonly //0=disponible en nuevo formulario y en edición
             //1=solo lectura en creación
             //2=solo lectura en edición
             //3=solo lectura tanto en edición como en creación
    subfrm  

    buffer:any //variable para almacenar los formularios a agregar de forma dinamica a JTabs

    cancelar = ["CANCELAR","ANULAR","SALIR","CERRAR","NO","BORRAR","ELIMINAR"]
    aceptar = ["ACEPTAR","OK","SI","REGISTRAR","GUARDAR","SALVAR","GRABAR"]
    
    alCargar(props:JformParam){
        this.rest['local'] = true
        this.tabla = props['tabla']??""

        this.id=props.id!=undefined?props.id:'frm'+(Math.random()*999).toFixed(0)
        this.titulo=props.titulo??""
        this.campos=props.campos??[] //formato de campos
        this.reg=props.reg??{}  //datos 
        
        this.full=props.full??false
        this.botones=props.botones??this.botones
        this.frmtab=props['frmtab']
        this.vfrm = props['vfrm']
        this.key = props['key']
        this.vtabla=props['vtabla']==undefined?false:props['vtabla ']

        this.tipo = props['data'] == undefined ? 0 : 1


        return <div id={this['id']}>
            {this.titulo?<h3 class={props['icono']??""}>{this.titulo}</h3>:""}
        </div>


    }

    async alCargado(el,props){
        //si no hay campos, buscar todos los campos de la tabla
        if (this.campos.length==0){
            //si no hay tabla
            if (this.tabla=""){
                el.append("No hay forma de contruir un formulario sin campos.");
                return
            }
            
            var campos=[]
            //si no hay un registro de datos se buscan los campos en la api
            if (React.obCompare(this.reg, {})){
                const data = await this.rest.get("/Tabla/esquema/"+props.tabla)
                if (data.error != "" ) {
                    el.append(data.error)
                    return
                }else{
                    campos = data.item
                }
            } else {
                //si existen datos en el registro
                campos = Object.keys(this.reg)
            }
        }

        el.append(<JTabs>
            <div tab="Ficha" icono="icon-table" sel={true}>
                {this.mkCampos(this['campos'].length==0?campos:this['campos'], this.reg)}
                <button>Aceptar</button>
            </div>
        </JTabs>)
    }

    mkCampos(campos, reg){
        if (typeof campos[0] == "string" ){
            campos=campos.map(i=>{return {etiqueta:i.toUpperCase(), campo:i, valor:reg[i]??""}})
        }
        return campos.map(i=>this.mkCampo(i))
    }

    mkCampo(item){
        const inputs= ["text","number","date","time","color","password", "hidden"]
        item.tipo = item.tipo==undefined?"text":item.tipo
        item.visible = item.visible==undefined?true:item.visible
        if (item.req != undefined) item.obligatorio=item.req
        
        item.readonly=item.readonly==undefined?0:item.readonly

        let soloLectura = false
        if (this.tipo==0 && item.readonly==0) soloLectura=false
        if (this.tipo==0 && item.readonly==1) soloLectura=true
        if (this.tipo==1 && item.readonly==2) soloLectura=true
        if (item.readonly==3) soloLectura=true

        const propiedades={
            info:item['info']??undefined,
            id:item.campo,
            etiqueta:item.etiqueta, 
            tipo:item.tipo, 
            valor:this.reg[item.campo]!=undefined?this.reg[item.campo]:(item.valor==undefined?'':item.valor), 
            readOnly:soloLectura,
            maximo:item.maximo,
            ayuda:item.ayuda,
            ayudan:item.ayudan,
            icono:item.icono,
            visible:item.visible,
            obligatorio:item.obligatorio,
            props:item.props==undefined?{}:item.props
        }

        if (inputs.indexOf(item.tipo)!=-1){
            const inp = new Input()
            const el = inp.alCargar(propiedades)
            inp.alCargado(el, propiedades)
            return el
        }
        if (item.tipo=="textarea")
            return <textarea style="min-height:60px" class={ "value " + item.visible?"":"oculto"}>
                {this.reg[item.campo]!=undefined?this.reg[item.campo]:''}
            </textarea>
        if (item.tipo=="JTree")
            return <div>-- Componente JTtree --</div>
        if (item.tipo=="JTab")
            return <div>-- Componente JTab --</div>
        if (item.tipo=="JSlider")
            return <div>-- Componente JSlider --</div>
        if (item.tipo=="JMenu")
            return <div>-- Componente JMenú --</div>
        if (item.tipo=="Icono")
            return <div>-- Componente Icono --</div>
    }
}

export default JForm
