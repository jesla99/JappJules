import JappN from "../libs/JappN.js";
import React from "../libs/MiReact.js";
import Rest from "../libs/Rest.js";
import Input from "./basicos/Input.js";


export default class JLogin extends JappN{
    app_id="0"
    token="0"
    

    alCargar(props){
        return <div class="_JLogin">
            <Input 
                type="text" 
                icono="icon-user" 
                etiqueta="Usuario:" 
                obligatorio="true"
            />
            <Input 
                type="password" 
                icono="icon-lock" 
                etiqueta="Clave:" 
                obligatorio={true}
            />
            <button onClick={()=>this.login()}>Ingresar</button>
        </div>
    }

    login(){
        let udata = this.el.querySelectorAll("input")
        const payload={
            usuario: udata[0].value,
            clave: udata[1].value
        }
        let rest = new Rest()
        rest['local']=true  //usa el backend local
        rest.post("/Usuario/login", payload)
        .then(data=>{
            if (data.error!= "") this.Dialogo({
                mensaje: <h1>{data.error}</h1>,
                botones:{Guardar:{}},
                bin:this,
                callBack:(data)=>{}
            })
            else {
                this.Cargar(this['_props'].vista)
                console.log("HAY ERRROR MUDO!!")
            }
        })

    }

    guardar(props){
        console.log(props)
    }
}