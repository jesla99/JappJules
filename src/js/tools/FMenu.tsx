import React from "../libs/MiReact.js"
import JappN from "../libs/JappN.js"

class FMenu extends JappN{
    data
    selected=0

    _keys=[
        {key:"F1", fnd:(e)=>this['run'](e)},
        {key:"F2", fnd:(e)=>this['run'](e)},
        {key:"F3", fnd:(e)=>this['run'](e)},
        {key:"F4", fnd:(e)=>this['run'](e)},
        {key:"F5", fnd:(e)=>this['run'](e)},
        {key:"F6", fnd:(e)=>this['run'](e)},
        {key:"F7", fnd:(e)=>this['run'](e)},
        {key:"F8", fnd:(e)=>this['run'](e)},
        {key:"F9", fnd:(e)=>this['run'](e)},
        {key:"F10", fnd:(e)=>this['run'](e)},
        {key:"F11", fnd:(e)=>this['run'](e)},
        {key:"F12", fnd:(e)=>this['run'](e)},
        /*{key:"F1", fnd:()=>this.comp('Info').selTab('Producto')},
        {key:"F2", fnd:()=>this.comp('Info').selTab('Clientes')},
        {key:"F3", fnd:(e)=>document.documentElement.requestFullscreen()},*/
        {code:"KeyM", ctrl:true, fnd:(e)=>this.$(".FMenu")[0]['switch'](e)}
        
    ]
    alCargar(props){
        this.data = props.data
        return <div class="FMenu">
            <button onClick={()=>this.visible()} class="nmo" style="height:20px;margin:4px"></button>
            {props.data.map((r,l)=><div>
                {r.map((i, n)=><button 
                    onClick={()=>this.run({key:"F"+(n+1)})}>
                    F{n + 1}
                    <span click="true">{i.nombre}</span></button>
                )}
                {/*<span><span>F{l+1}</span></span>*/}
            </div>
            )}
        </div>
    }

    alCargado(el){
        this.el = el
        el['run']=(e)=>{
            this.run(e)
        }
        el['switch']=()=>this.toogle()
        this.sel(0)
    }

    run(e){
        //document.documentElement.requestFullscreen()
        const f = e.key.substring(1)-1
        if (f>-1){
            this.data[0][f].fnd()
        }
    }

    toogle(){
        if (this.el.classList.contains('FMShow')){
            this.el.classList.remove('FMShow')
        }else{
            this.el.classList.add('FMShow')
        }
    }


    visible(){
        if (this.el.querySelector('div').classList.contains('nmv')){
            this.el.querySelector('div').classList.remove('nmv')
        }else{
            this.el.querySelector('div').classList.add('nmv')
        }
    }

    sel(index){
    
        this.$(this.el).find('div')[index].className="sel"

    }
} 

export default FMenu