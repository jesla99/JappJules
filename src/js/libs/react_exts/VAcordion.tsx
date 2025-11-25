export default class VAcordion{
    constructor(tag){
        const items = tag.children
        for (let i=0; i<items.length; i++){
            const name = document.createElement('span')
            name.className=items[i].getAttribute('icono')
            name.innerHTML = items[i].getAttribute('nombre')
            items[i].prepend(name)
            name.onclick=(e)=>this.clic(e.target)
        }
    }

    clic(t){
        
        const items = t.parentNode.parentNode.children
        for (let i=0; i<items.length; i++){
            items[i].classList.remove('sel')
        }
        t.parentNode.classList.add('sel')
    }
}