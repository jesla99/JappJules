import React from "../libs/MiReact.js"
import JappN, {$} from "../libs/JappN.js"

interface JSliderParam{
    id:string
    class?:string //class para el componente
    wClass?:string  //class para el wrapper
    iClass?:string //class para los items
    tipo?:string //tagName del elemento a buscar
    height?:string //alto
    res?:any[]
}

class JSlider extends JappN{
    slider
    alCargar(props:JSliderParam, cont){
        this.id=props.id
        props.class=props.class!=undefined?props.class:""
        props.wClass=props.wClass!=undefined?props.wClass:""
        props.tipo=props.tipo!=undefined?props.tipo:"DIV"
        props.height=props.height!=undefined?props.height:"auto"
        props.res=props.res!=undefined?props.res:[]


        return <div id={props.id} class={"JSlider "+props.class} style={"height:"+props.height}>
            <div class={"wrapper "+props.wClass} style={"height:"+props.height}>
                {this.getDivs(cont, props.tipo)}
                {props.res.map(i=>i.tagName=="DIV"?i:<div class={props.iClass}>{i}</div>)}
            </div>
        </div>
    }

    alCargado(el){
        el['agregar']=(e)=>this.agregar(e)
        const me=this
        const slider = el
        this.slider = el
        const contenido = slider.querySelector('.wrapper')
        let isDragging = false
        let startPos, currentPos
        let offset=0
        let click=true

        slider.addEventListener('mousedown', dragStart)
        slider.addEventListener('touchstart', dragStart)

        function dragStart(e) {
            if (!me.isMobile()) e.preventDefault();
            const sliderAncho = slider.getBoundingClientRect().width
            const contenidoAncho = contenido.getBoundingClientRect().width
            if ( contenidoAncho < sliderAncho) return
            isDragging = true
            startPos = getPosition(e)
        }

        slider.addEventListener('mousemove', dragMove)
        slider.addEventListener('touchmove', dragMove)

        function dragMove(e) {
            if(!isDragging) return
            currentPos = getPosition(e)
            if ( Math.abs(currentPos - startPos) > 20 )click=false
            updateSlidePosition(currentPos - startPos)
        }

        slider.addEventListener('mouseup', dragEnd)
        slider.addEventListener('touchend', dragEnd)
        document.addEventListener('mouseup', dragEnd)

        function dragEnd(e) {
            if (!isDragging) return
            isDragging = false
            const style = getComputedStyle(contenido)
            const t=style.transform.match(/matrix\(([^,]*),[^,]*,[^,]*,[^,]*,([^,]*),[^,]*\)/)
            const translation = t==null?[]:t
            
            const dir = offset-parseFloat(translation[2]) > 0?0:1
            const sliderAncho = slider.getBoundingClientRect().width
            const contenidoAncho = contenido.getBoundingClientRect().width

            offset = parseFloat(translation[2])
            
            //si el contenido es menor que el contenedor
            if ( contenidoAncho < sliderAncho ){
                if (dir==1) offset = (sliderAncho-contenidoAncho)
                else offset=0
            }else if (offset>0) {
                contenido.style.transform = `translateX(0px)`
                offset=0
            }else{
                if (offset < ( sliderAncho - contenidoAncho ) )
                    offset = sliderAncho - contenidoAncho
            }
            contenido.style.transform = `translateX(${offset}px)`
            if (!click) {
                click=true
                const hijos=slider.querySelectorAll("*")
                hijos.forEach(e=>e.setAttribute("lock", true))
                setTimeout(()=>hijos.forEach(e=>e.removeAttribute("lock")),10)
                alinear(dir)
            }
            
        }
    
        function alinear(dir:number){
            const elementos = Array.from(document.querySelectorAll("#"+slider.id+">.wrapper>*"))
            const rects = elementos.map(i=>i.getBoundingClientRect())
            //indice,cercania
            let cerca=[100000,100000]
            for (let i=0;i<rects.length;i++){
                const dist = Math.abs(rects[i].left)
                if (dist < cerca[1]) cerca=[i,dist]
            }
            contenido.classList.add("ajustar")
            contenido.style.transform = `translateX(${offset - rects[cerca[0]].left}px)`
            setTimeout(()=>contenido.classList.remove("ajustar"),500)
        }

        function getPosition(e) {
            let position = 0
            if(e.type === 'touchstart' || e.type === 'touchmove') position = e.touches[0].clientX
            else position = e.clientX
            return position
        }

        function updateSlidePosition(distance) {
            contenido.style.transform = `translateX(${distance + offset}px)`
        }

        // Initialize
        updateSlidePosition(0);
    }

    agregar(item){
        this.$(this.slider).find('.wrapper').eq(0).append(item)
    }
}

export default JSlider