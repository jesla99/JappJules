/**
 * Extensión de jsx que permite volver editable a un div, span, li o cualquier elemento que posea innerHTML.
 * Programado por: Jesus Laynes
 * 
 * version 1.0
 * version 1.0.1 : se agrega tooltip para indicaciones, 
 */

export default class Edit{
    valor
    constructor(tag, props){
        tag.title="Doble clic para editar..."
        tag.ondblclick=(e)=>{
            this.valor=e.target.innerText;
            e.target.setAttribute('contenteditable', true);
            e.target.focus()
            tag.title="Click fuera para dejar de editar."
        }

        tag.onblur=(e)=>{
            tag.title="Doble clic para editar..."

            e.target.setAttribute('contenteditable', false); 
            if(e.target.innerText != this.valor)
                props.callBack(e.target)
        }
    }
}
