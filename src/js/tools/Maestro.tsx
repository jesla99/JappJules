import JappN from "../libs/JappN.js";
//import Form from "./Form.js";
import Rest from '../libs/Rest.js'
//import * as iMaestro from "../interfaces/Maestro"
//import {formParam} from '../interfaces/Form'


/*
class Maestro extends JappN{
    quebrar
    tabla
    criterio  //escrito en SQL WHERE
    pag
    lineas
    campos
    mask
    key
    search
    titulo
    fijarfrm
    frmtab
    frm
    vfrm
    res
    callBack:Function=(...e)=>{return false}
    botones
    ops
    vtabla
    rest
    
    formulario //propiedad interna
    data
    //alCargar(props:iMaestro.maestroParam){
    alCargar(props){        
        if (props['ops'] != undefined) this.ops = props.ops instanceof Array?props.ops:[props.ops]
        this.id = props.id==undefined?'maestro':props.id
        this.rest = props.rest==undefined?true:props.rest
        this.search = props.search==undefined?'':props.search
        this.quebrar = props.quebrar==undefined?550:props.quebrar
        this.tabla = props.tabla==undefined?'':props.tabla
        this.vtabla = props.vtabla==undefined?'':props.vtabla
        this.criterio = props.criterio==undefined?'':props.criterio
        this.mask = props.mask==undefined?{}:props.mask
        this.pag = props.pag==undefined?0:props.pag
        this.lineas = props.lineas==undefined?50:props.lineas
        this.campos = props.campos==undefined?'*':props.campos
        this.key = props.key==undefined?'':props.key
        this.titulo = props.titulo==undefined?'':props.titulo
        this.frmtab = props.frmtab==undefined?undefined:props.frmtab
        this.fijarfrm = props.fijarfrm==undefined?false:props.fijarfrm
        this.frm = props.frm==undefined?'':props.frm
        this.vfrm = props.vfrm
        this.botones=props.botones==undefined?['Aceptar','Cancelar']:props.botones
        this.callBack=props.callBack==undefined?this.callBack:props.callBack

        if (this.key == '' && this.tabla != '') this.key = this.tabla + "_id"

        //si existe un formulario
        if (this.frm != ""){
            //if (this.key=="") this.key=this.tabla+"_id"
            if (this['ops']==undefined)this['ops']=[]
            this['ops'].unshift({flag:"Abrir", icono:"icon-edit", ayuda:"Editar Registro"})
        }


        //formatear opciones
        if (this.ops != undefined)
            this.ops = this.ops.map((i:string|iMaestro.itemOps)=>typeof i=='string'?{flag:i}:i)
        
        const tabla = "#"+this.id

        const btImp=<img src="css/print.png" onClick={()=>{    
            this.$(tabla).print({titulo:props.titulo})
        }} class="barIcono fd" title="Imprimir" />

        return <div>
            { props.titulo?<h1 class={props.icono!=undefined?props.icono+" c":"c"}>{props.titulo}</h1>:""}
            <div class="panel">
                { this.frm!=''?<i onClick={()=>this.abrir(0)} class="barIcono icon-plus-circled" title="Nuevo Registro" />:''}
                { props.noPrint!=undefined?btImp:'' }
                { this.fijarfrm === true?this.mkForm(0):""}
                <div id={this.id + '_detalle'}></div>
            </div>
        </div>
    }

    alCargado(el, props){
        
        if (typeof this.fijarfrm =="string") $(this.fijarfrm).val(this.mkForm(0))

        el['filtrar']=(e)=>{this.filtrar(e)}
        el['cargar']=(e)=>{this.cargar(e)}

        this.pag = props.pag==undefined?0:props.pag

        this.verPagina(this.pag)

        this.Evento(el,"get", this.get)
    }

    cargar(valor){
        this.criterio = this.search + " like '%" + valor+ "%' "
        this.verPagina(0)
    }

    filtrar(e){
        console.log( "Filtrando Maestro", e )
    }

    verPagina(pag){
        this.pag=pag

        //React.mainView=this.mainView //define el constructor de la vista principal
        this.$("#"+ this.id +"_detalle").val(<div class="panel c"> Buscando ... </div>)
        const ops ={
            tabla:this.tabla,
            pag:this.pag,
            lineas:this.lineas,
            campos:this.campos,
            criterio:this.criterio
        }
        if (!this.rest){
            const lazy = new Lazy({lazyCacheHard:true})

            lazy.call("getTabla", ops)
            .then((data:any)=>{
                this.renderTabla(data)
            })
        }else{
            const miRest = new Rest();
            let promesa
            if (this.criterio){
                promesa = miRest.get(`/Tablas/${this.tabla}/Where/${this.criterio}`)
            }else{
                promesa=miRest.patch(`/Tablas/${this.tabla}`, ops)
            }

            promesa.then((data:any)=>{
                if (data.error) console.log(data)
                else this.renderTabla(data)
            })

        }
    }

    renderTabla(data){
        if(!this.e(data)){
            this.data=data.res
            if (data.res.length > 0){
                const Masks = Object.keys(this.mask)

                this.res=data.res
                const fila = <tr></tr>

                for(var i in data.res[0]){
                    if ( Masks.length == 0){
                        this.$(fila).append(<th >{i}</th>)
                    }else if (Masks.indexOf(i) > -1){
                        const clase=this.mask[i]['class']=='oculto'?'oculto':''
                        this.$(fila).append(<th data-id={i} class={clase}>{this.mask[i]['label']==undefined?i:this.mask[i]['label']}</th>)
                    }
                }

                if (this.ops != undefined){
                    this.$(fila).append(<th></th>)
                }
                
                const miTabla = <table id={this.id} data-quebrar={this.quebrar}>{fila}</table>
                this.$(miTabla).append(data.res.map((item, index)=>{
                    const RegId=this.key!=''?item[this.key]:0
                    const fila=<tr tabindex="0" data-id={this.key!=''?item[this.key]:0}></tr>
                    for (var i in item){
                        if ( Masks.length == 0 || Masks.indexOf(i) > -1){
                            
                            const id = item[i]
                            //si existe formulario el ID abrira el formulario 
                            //si no existe el id regresará el callBack de la tabla
                            const click = (i==this.key&&this.frm!='')?()=>this.abrir(id):()=>this.callBack("reg", id, this.data[index])

                            if (this.mask[i]==undefined) this.mask[i]={};
                            const clase= this.mask[i]['class']!=undefined?this.mask[i]['class']:''

                            // this.parent.mainView=this
                            // this.$(fila).append(this.parent.createElement('td', {click:true, onclick:click, class:clase, style:i==this.key?'cursor:pointer':''}, item[i]==null?'--':item[i]))

                            this.$(fila).append(this.createElement('td', {click:true, onClick:click, class:clase, style:i==this.key?'cursor:pointer':''}, item[i]==null?'--':item[i]))
                        }
                    }
                    if (this.ops != undefined) this.$(fila).append(<td class="c">{this.ops.map(item=><button title={item.ayuda==undefined?"":item.ayuda} class={item.icono==undefined?"":item.icono} onClick={(e)=>this.opciones(item.flag, RegId)}>{item.titulo==undefined?item.flag:item.titulo}</button>)}</td>)
                    return fila
                }))
                

                const nav = <div></div>;
                const paginas = data.regs / data.lineas

                if ( paginas > 1){
                    const ps =new Array(Math.ceil(paginas)).fill(0).map((v, i) => i)
                    if (data.pag > 0 ) this.$(nav).append(<button onClick={()=>this.verPagina(data.pag-1)} class="icon-left-open"></button>)
                    this.$(nav).append(<label><select onChange={(e)=>this.selPag(e.target)}>
                        {ps.map(i=>{
                            
                            return <option selected={i==data.pag?true:false} value={i}>Página {i+1}</option>
                        })}
                    </select></label>)
                    if (data.pag < paginas-1)this.$(nav).append(<button onClick={()=>this.verPagina(data.pag+1)} class="icon-right-open"></button>)
                }


                this.$("#"+ this.id +"_detalle").val([miTabla, nav])
                this.$(miTabla).tabla()
            }else{

                this.$("#"+ this.id +"_detalle").val(<div class="panel c">No hay datos </div>)
            }
        }
    }


    opciones(flag, id){
        if (flag=="Abrir") this.abrir(id)
        this.callBack("reg", id, flag)
    }

    selPag(o){
        this.verPagina(o.value)
    }

    refresh(tipo=0){
        //si hay que volver al servicio
        //if (tipo==1)
        this.verPagina(this.pag)
    }

    get(id){
        if(this.res == undefined) return false
        for(var i=0; i<this.res.length; i++){
            if ( this.res[i][this.key] == id) {
                return this.res[i]
            }
        }
        return false
    }

    abrir(id){
        if (this.fijarfrm ===false)
            this.Pantalla(this.mkForm(id))
        else{
            //desSerializar
            this.setCampos($(this.formulario).find("#frm")[0], this.get(id))
        }        
    }

    mkForm(id){
        this.formulario = <Form 
            titulo={this.titulo} 
            full={true} 
            campos={this.frm} 
            data={this.get(id)}
            botones={this.botones} 
            callBack={(reg,e,x)=>this.frmCallBack(reg,e,x)}
            frmtab={this.frmtab}
            vfrm={this.vfrm}
            key={this.key}
        />
        return this.formulario
    }

    frmCallBack(reg, btn, yesNot){
        if (yesNot[0].indexOf(btn.toUpperCase()) > -1 ){
            if (typeof reg['_error_'] != undefined) {
                const mensaje=[<h3>Advertencia</h3>,<p>{reg._error_.map(i=><div style="padding:4px">* {i}</div>)}</p>]
                
                this.Dialogo(mensaje)
                return 
            }
            //Si no se ha definido un callBack, por defecto devuelve false 
            //if ( this.callBack("frm", reg, btn) !== false  ) return
            this.callBack("frm", reg, btn)
    
            //agregar un if que ejecute esto si y solo si es el boton Aceptar
            ///agregado 
            if (this.rest) {
                const miRest = new Rest()
                const id= Number(reg[this.key])
                if(id==0) delete reg[this.key]
    
                const data={
                    tabla:this.tabla,
                    key:this.key,
                    id:id,
                    reg:reg
                }
    
                if (this.vtabla != ''){
                     data['vtabla'] = this.vtabla
                     miRest.post(`/Tablas/Vistas/${this.tabla}`, data)
                     .then(rdata=>this.postSet(rdata, reg))
                }else{
                    if (id==0) miRest.post(`/Tablas/${this.tabla}`, data)
                        .then(rdata=>this.postSet(rdata))
                    else miRest.put(`/Tablas/${this.tabla}`, data)
                        .then(rdata=>this.postSet(rdata,reg))
                }
    
            } else {
                const lazy = new Lazy()
                lazy.call("setTabla", {tabla:this.tabla, reg:reg})
                .then((data:any)=>{
                    this.postSet(data, reg)
                })
            }
        }else{
            if (this.fijarfrm !== false) this.abrir(0)
        }
    }

    postSet(data, reg={}){

        if (data.error != '') console.log(data)
        if (!this.e(data)){
            // const tipo=reg[this.tabla+"_id"]==""?1:0
            // this.refresh(tipo)
            this.refresh(1)
            if (this.fijarfrm === false) this.CerrarPantalla()
            else{
                reg.forEach((d,k)=>reg[k]='')
                this.setCampos($(this.formulario).find("#frm")[0],reg)
                
            }
        }
    }

    alLEditSalir(e: any, buffer) {
        //si maestro no es el contructor principal
        if (this.mainView.constructor.name != this.constructor.name){
            if (this.mainView.alLEditSalir(e) !== false) return
        }

        const cellIndex = e.cellIndex
        const campo = {
            nombre:e.parentNode.parentNode.rows[0].cells[cellIndex].getAttribute("data-id"),
            valor: buffer,
            id:e.parentNode.getAttribute('data-id'),
            key:this.key
        }
        
        const lazy=new Lazy()
        lazy.call('setTabla', {tabla:this.tabla, campo:campo})
        .then(data=>{
            this.e(data)
        })
        if ( this.parent!=undefined && this.parent.alLEditSalir != undefined) this.parent.alLEditSalir(e,buffer)
    }

    alLEditEntrar(e, element){
        if (this.mainView.constructor.name != this.constructor.name)
            this.mainView.alLEditEntrar(e)
    }
}

export default Maestro
*/