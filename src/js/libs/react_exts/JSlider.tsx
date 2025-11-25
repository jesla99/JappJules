export default class JSlider{

    constructor(tag){
        setTimeout(()=>this.iniciar(tag), 100)
    }

    iniciar(tag){
        let contenedor:HTMLElement=document.createElement('DIV')
        if (tag.childNodes.length == 1){
            if (tag.childNodes[0].tagName == "DIV"){ //si el unico elemento es un div
                if (tag.childNodes[0].childNodes.length > 0){
                    contenedor = tag.childNodes[0]
                }
            }
        }

        if (contenedor.innerHTML == ''){
            //const div = document.createElement('DIV')
            const items = tag.children
            contenedor.append(...items)
            tag.append(contenedor)
        }
        
        const imgs = tag.querySelectorAll("div>img")
        imgs.forEach(i=>i.setAttribute("draggable", false))

        let startX
        let isDrag=false
        let direccion:any
        let origen
         

        const vistaAncho=tag.getBoundingClientRect().width
        const items = contenedor.children        
        for(let i=0; i<items.length;i++) {
            const element = items[i]
            if (vistaAncho > 0) element['style'].maxWidth=vistaAncho+"px"
            //console.log(element, element.style.maxWidth)
        }

        setTimeout(()=>{
            const alto =contenedor.getBoundingClientRect().height
            if (alto>0) tag.style.height = alto+"px"
        }, 100)

        contenedor.onmousedown=(e)=>{init(e)}
        contenedor.ontouchstart=(e)=>{init(e.touches[0])}
        function init(e){
            contenedor?.classList.remove('suave')
            origen = e.clientX
            startX = e.clientX - distancia(tag, contenedor)    
            isDrag=true
        }

        contenedor.onmousemove=(e)=>{mover(e)}
        contenedor.ontouchmove=(e)=>{mover(e.touches[0])}
        function mover(e){
            if (!isDrag) return 
            e.target.setAttribute('lock', true)
            const left =Number( e.clientX - startX) + "px"  
            contenedor.style.left=left
            direccion =  Number(e.clientX) - origen
        }

        contenedor.onmouseup=(e)=>salir(e,e)
        contenedor.onmouseleave=(e)=>salir(e,e)
        contenedor.ontouchend=(e)=>salir(e.touches[0], e)

        function salir(e, el){
            isDrag=false
            //evaluar posicion
            if (direccion < 0){
                regresar()
            }else if(direccion >0){
                avanzar()
            }
            direccion =0
            setTimeout(()=>el.target.removeAttribute('lock', false),10)

        }
    
        function regresar(){
            const items = tag.querySelectorAll('div>*')
            for (let i=0; i<items.length; i++){
                const dist = distancia(tag, items[i])
                const posx = distancia(contenedor, items[i])
    
                //const margen = contenedor.getBoundingClientRect().left 
    
                if (dist > -20){
                    contenedor?.classList.add('suave')
                    contenedor.style.left = -posx+"px"
                    return
                }
            }
            const posx = distancia(contenedor, items[items.length-1])
            contenedor?.classList.add('suave')
            contenedor.style.left = -posx+"px"
        }
    
        function avanzar(){
            const items = tag.querySelectorAll('div>*')
            const contAncho = tag.getBoundingClientRect().width
            for (let i=items.length-1; i>-1; i--){
                const itemAncho = items[i].getBoundingClientRect().width
                const dist = distancia(tag, items[i]) + itemAncho
                //const posx = distancia(contenedor, items[i])
              
                if (dist < contAncho + 20){
                    contenedor?.classList.add('suave')
                    const margen =contenedor.getBoundingClientRect().left + (contAncho - dist - 11)
 
                    contenedor.style.left = margen +  "px"
                    return
                }
            }
            contenedor?.classList.add('suave')
            const itemAncho = items[1].getBoundingClientRect().width
            const margen = contAncho - itemAncho
            contenedor.style.left = margen +  "px"
    
        }
    
        function distancia(el1, el2){
            const padre = el1
            const hijo = el2
    
            // Obtener las coordenadas del padre y del hijo
            const rectPadre = padre.getBoundingClientRect();
            const rectHijo = hijo.getBoundingClientRect();
    
            // Calcular la distancia entre el hijo y el borde izquierdo del padre
            const distancia = rectHijo.left - rectPadre.left;
            return distancia
        }
    }

}