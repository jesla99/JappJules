
/**
 * Programado por Jesus Laynes 17 noviembre 2025 fabrica un panel con columnas redimensionables.
 */

export default class JPanel{
    version= "0.1"
    esColap:boolean=false
    autoWidth:boolean=true
    tag

    constructor(tag, props={}){

      this.tag=tag
      this.esColap = props['esColap']??false
      this.autoWidth = props['autoWidth']??true

      tag.classList.add("_JPanel-principal")
      
      const nCols = tag.children.length-1
      //formatear columnas
      for (let index=0; index<tag.children.length; index++){
        const item = tag.children[index]

        if ( !item.querySelector(".content") ){
          const contenido = <div class="content"></div>
          
          while (item.firstChild) {
            contenido.appendChild(item.firstChild);
          }
          
          if (props['esColap']){
            const iconColap = <i class="jsx_Colap" style="float:left" callBack={(e)=>this.Colap(e)}></i>
            item.appendChild(iconColap)
          }
          item.append(contenido)
        }

        if (index != nCols){
          item.classList.add("_JPanel-columna", "fija")
          item.style.width = item.getAttribute("width")
          if(!item.querySelector("._JPanel-resizer"))  item.append(<div class="_JPanel-resizer"></div>)
        }else{
          item.style.width="100%"
          item.style.backgroundColor="white"
        }
      }
      this.init(tag)
    }
    
    init(el){
        const contenedor = el;
        const columnas:any = contenedor.querySelectorAll('._JPanel-columna');
        const ultimaColumna = contenedor.lastElementChild;
      columnas.forEach(columna => {
        const resizer = columna.querySelector('._JPanel-resizer');
        if (!resizer || columna === ultimaColumna) return; // No redimensionar la última

        let startX = 0;
        let startWidth = 0;
        let startNextWidth = 0;
        let isResizing = false;

        resizer.addEventListener('mousedown', (e:any) => {
          isResizing = true;
          startX = e.clientX;
          startWidth = columna.offsetWidth;
          startNextWidth = columna.nextSibling.offsetWidth-4;
          columna.classList.add('dragging');
          document.body.style.userSelect = 'none';
          e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
          if (!isResizing) return;

          const diffX = e.clientX - startX;

          /* Limita ancho de celdas**/
          const cols = columna.parentNode.children
          const tAncho = columna.parentNode.getBoundingClientRect().width-100
          let aCols = 0
          for (let i=0; i<cols.length-1; i++){
            aCols += parseInt(cols[i].style.width)
          }
          if (diffX > 0 && tAncho <= aCols) return
          
          
          const nuevoAncho = Math.max(80, startWidth + diffX);
          columna.style.width = nuevoAncho+4 + 'px';

          if (this.autoWidth)
            if (nuevoAncho > 80) columna.nextElementSibling.style.width = Math.max(80, (startNextWidth - diffX)) + "px"          
          
          // Forzar recalculo del layout para que la última columna se ajuste
          contenedor.style.transition = 'none';
          requestAnimationFrame(() => {
            contenedor.style.transition = '';
          });
        });

        document.addEventListener('mouseup', () => {
          if (isResizing) {
            isResizing = false;
            columna.classList.remove('dragging');
            document.body.style.userSelect = '';
          }
        });
      });
    }

    Colap(e){
      if (!e.target.classList.contains('close')){
        e.target.parentNode.classList.add("_JPanel-colap")
      }else{
        e.target.parentNode.classList.remove("_JPanel-colap")
      }
    }
}