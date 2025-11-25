//import React, {JappM, Lazy} from 'libs/JappM'
import React from '../libs/MiReact.js'
import JSlider from './JSlider.js'
import {tabParam, tabsParam} from '../interfaces/JTabs'
import JappN from '../libs/JappN.js'


class JTabs extends JappN{
  contenido:undefined|tabParam[]
  divs:HTMLElement[]
  sel:number=-1
  length:number=0
  onOpen:Function=(...e)=>console.log(e)
  onFocus:Function=(...e)=>console.log(e)
  forceOpen=false
  mini:boolean

  alCargar(props:tabsParam, contenido){
    this.id=props.id==undefined?("t"+(Math.random()*9999).toFixed(0)):props.id
    props.id=this.id
    if (props.onOpen!=undefined) this.onOpen=props.onOpen
    if (props['onFocus']!=undefined) this.onFocus=props['onFocus']
    this.forceOpen=props.forceOpen!=undefined?props.forceOpen:false
    props.class=props.class==undefined?'':props.class
    this.contenido = props.res?props.res:undefined
    this.mini = props.mini!=undefined?props['mini']:false
    
    
    this.divs = this.validar(contenido)

    return <div id={props.id} class={"JTabs " + props.class + " " + (this.mini==true?'mini':'')}>
      {/* <div class="tabs">{this.mkMuesca()}</div> */}
      <JSlider id={"tab_"+props.id} wClass="tabs">{this.mkMuesca()}</JSlider>
      <div class="JTabsContent">{this.mkContenido()}</div>
    </div>
  }

  alCargado(el){
    this.el=el
    el['agregar']=(e)=>this.agregar(e)
    el['focus']=(e)=>this.focus(e)
    

    const tabs=this.$(el).find(".tabs")[0]
    if (this.sel!= -1){
      this.$(el).find(".JTabsContent > div")[this.sel].classList.remove('oculto')
    }
    
  }

  mkMuesca(){
    if (this.contenido != undefined){
      this.length=this.contenido.length
      return this.contenido.map((item:tabParam, index:number)=>{
        if (this.mini && item.icono==undefined) item.icono="icon-box" 
        if (item.sel) this.sel = index
        const title = this.mini?item.tab:"" 
        return<div
          title={title} 
          class={
            (item.icono?item.icono:"")
            +" "
            +(item.sel!=undefined?"tabSel":"")
          } 
          data-id={index} onClick={(e)=>this.show(e)} ><span click={true}>{item.tab}</span></div>
      })
    }else{
      this.length=this.divs.length
      return this.divs.map((item:HTMLElement, index:number)=>{
        if (this.mini && item.getAttribute('icono')==undefined) item.setAttribute('icono',"icon-box") 
        if (item.getAttribute("sel")!=null) this.sel = index
        const icono = item.getAttribute("icono")==null?"":item.getAttribute("icono")
        return <div click={true} class={(item.getAttribute("sel")!=null?"tabSel":"") + " " + icono} data-id={index} onClick={e=>this.show(e)}>{item.getAttribute("tab")!=null?<span click={true}>{item.getAttribute("tab")}</span>:"Tab "+ (++index)}</div>
      })
    }
  }

  show(e){
    const target=e.target.getAttribute('data-id')?e.target:e.target.parentNode
    this.$(target.parentNode).find("div").removeClass("tabSel")
    target.classList.add('tabSel')
    const padre = this.$(target.parentNode.parentNode.parentNode)[0]
    const contenidos = this.$("#"+  padre.id +">.JTabsContent>div")
    
    const index = target.getAttribute("data-id")
    contenidos.addClass("oculto")
    this.$(contenidos[index]).removeClass("oculto")

    //contenido dinamico
    const contenido = this.$(contenidos[index])[0].innerText
    /*
    if (contenido.substring(0,1) =="{" && contenido.substring(contenido.length-1)=="}"){
      const data=contenido.substring(1, contenido.length-1).split(":")
      const lazy = new Lazy()
      lazy.importar("../vistas/"+data[0]+".js")
      .then((m:any)=>{
          const tag:any = this.createElement(m,{id:data[1]},null)
          this.$(contenidos[index]).val(tag)
      })
    }
    */

    if (contenidos[index].innerHTML == '' || this.forceOpen) {
      this.onOpen(e, contenidos[index])
      setTimeout(()=>this.onFocus(contenidos[index]), 100)
    }else{
      this.onFocus(contenidos[index])
    }
  }

  focus(name:string){
    console.log(this.divs)
  }

  mkContenido(){
    let myContent:any[]=[]
    if ( this.contenido != undefined ){
      for (let i=0; i<this.contenido.length; i++){
        if (this.contenido[i].contenido != undefined){
          const tabContent:any= this.contenido[i].contenido
          if (typeof tabContent == "string" ) myContent.push(<div>{tabContent}</div>)
          else myContent.push(tabContent)
        }else{ //si no hay contenido como parametro
          myContent.push(this.divs[i]==undefined?<div></div>:this.divs[i])
        }
      }
    }else{ //si hay que evaluar divs
      myContent = this.divs
    }
    
    for(let i=0;i<myContent.length;i++){
      myContent[i].classList.add('oculto')
    }
    return myContent
  }

  validar (contenido){
    let myContent:any[] = []
    for (let i=0;i<contenido.length;i++)
      if (contenido[i].tagName == "DIV")
        myContent.push(contenido[i])
      else {
        if (contenido[i].constructor.name == "Array")
          myContent = myContent.concat(this.validar(contenido[i]))
    }
    return myContent
  }

  agregar (item){
    const nombre = typeof item.tab == "string"?item['tab']:item['tab'].nombre
    const icono = typeof item.tab == "string"?"":(item['tab'].icono== undefined?'':item['tab'].icono)
    const tabs = this.$("#tab_"+this.id)[0]
    tabs['agregar'](<div class={(item.sel?' tabSel ':'') + icono} data-id={this.length} onClick={(e)=>this.show(e)}>{nombre}</div>)
    this.$("#"+this.id+" .jpTabsContent").eq(0).append(<div class={item.sel==undefined?'oculto':''} tab={item.tab}>{item.contenido}</div>)
    this.length++
  }  

  selTab(tab:string){
    const tabs = this.el.querySelectorAll("div.tabs>div")
    let myTab=undefined
    tabs.forEach(i=>{
      if (i.querySelector('span').innerHTML == tab)
        myTab = i
    })
    if (myTab!= undefined)
      this.show({target:myTab})
  }
}

export default JTabs
