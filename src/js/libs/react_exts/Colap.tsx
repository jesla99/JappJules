/**
 * 12/11/2025 Jesus Laynes: Se agrega la opción de leer un callBack en propiedaes y colocar el handler de accion Solamente en el signo +
 */

export default class Colap{
    version="1.0.1"
    constructor(tag, props){
        //tag.classList.add("icon-plus")
        tag.classList.add("icon-down-open-1")
        
        //tag.style.cursor="pointer"
        tag.onclick=(e)=>{
            if (!e.target.classList.contains('icon-down-open-1') && !e.target.classList.contains('icon-right-open-1') ) return
            
            if (props['callBack'] != undefined) props['callBack'](e)
            const cont=e.target.nextSibling
            if (e.target.classList.contains("close")){
                e.target.classList.remove("close")
                cont.classList.remove('hide')
                e.target.classList.remove('icon-right-open-1')
                e.target.classList.add('icon-down-open-1')
                
            }else{
                e.target.classList.add("close")
                cont.classList.add('hide')
                e.target.classList.add('icon-right-open-1')
                e.target.classList.remove('icon-down-open-1')
            }
        }
    }
}
