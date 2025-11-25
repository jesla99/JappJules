import JappN from "../JappN.js";
import React from "../MiReact.js";
import Rest from "../Rest.js";

/**
 * Programado por jesus Laynes 23-10-2025
 * Genear una galería de medios que devuelve la url del recurso
 * Se agregan cambios para el manejo de errores 28/10/2025 David Espinoza
 * Se agrega id al boton 30/10/2025 David Espinoza
 * Funcion de mejora que quita x en span se actualiza para no quitar la x del nombre del archivo 06/11/2025 David Espinoza
 * Se agrega nueva funcion para limpiar el texto para que la ruta no tenga ñ tildes o signos y se guarda con texto limpio sin quitar: (. / _ -) 06/11/2025 David Espinoza
 */


export default class Media extends JappN{
    version="0.1.2"
    website_id
    rest
    tag
    ruta
    constructor(tag, props){
        super()
        this.tag=tag
        this.rest = new Rest()
        this.rest.restLevel=1

        setTimeout(()=>this.iniciar(props), 50)
    }
 
    limpiarTexto(cadena) {
        // Reemplazar caracteres con tilde por su equivalente sin tilde
        const sinTildes = cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        // Reemplazar la ñ por n y Ñ por N
        const sinEnie = sinTildes.replace(/ñ/g, "n").replace(/Ñ/g, "N");
        // Eliminar caracteres especiales excepto -, _ y /
        return sinEnie.replace(/[^a-zA-Z0-9 _\-\/\.]/g, "");
    }

    iniciar(props){
        this.tag.style.borderRadius="4px 0px 0px 4px"
        this.tag.insertAdjacentElement('afterend', <button 
            class="icon-folder-open-1" 
            onClick={()=>this.openGallery(this.tag)} 
            id={"btn-"+props.id}
            style="border-radius:0px 4px 4px 0px">
        </button>);
        this.tag.insertAdjacentElement('afterend', <input type="file" id="_galUpFile_"  style="display:none"/>)

        // CORREGIDO: Verificamos si el input existe antes de agregar listener
        const fileInput = document.querySelector("#_galUpFile_");
        if (fileInput) {
            fileInput.addEventListener("change", (e)=>{
                const file = e.target['files'][0]
                const reader = new FileReader()
                reader.onload = async (e) => {
                    // El resultado (e.target.result) es la cadena Base64 (Data URL)
                    const base64:string = e.target.result.toString().split(",")[1]

                    const data = await this.rest.post("/Galeria", {
                        website_id:this.website_id,
                        ruta: this.limpiarTexto(this.ruta + "/" + file.name),
                        data: base64
                    })

                    this.openFolder({innerHTML:""})
                };
                reader.readAsDataURL(file);
            })
        }
    }

    async openGallery(tag){
        const website_id = tag.getAttribute("website_id")||0
        const ruta = tag.getAttribute("ruta")||""
        this.ruta = ruta
        this.website_id=website_id
        this.verGallery(website_id, ruta)
    }

    async verGallery(website_id, ruta){
        const data = await this.rest.get(`/Galeria?website_id=${website_id}&ruta=${ruta}`)
        console.log(data)
        this.Dialogo({
            titulo: "Galeria de Medios",
            mensaje: <div>
                <div><input style="width:300px;border-radius:4px 0px 0px 4px" placeholder="Nueva Carpeta" />
                <button onClick={(e)=>this.mkFolder(e.target)} style="border-radius:0px 4px 4px 0px">+</button> 
                &nbsp;||&nbsp; 
                <button class="icon-up-big" onClick={()=>this.initLoad()}>Subir archivo</button><hr /></div>
                <div id="_galContent_">
                    {this.renderData(data)}
                </div>
            </div>,
            win:"medio",
            botones:{"Cargar Recurso":"abrir"},
            callBack: this.galleryResp,
            bin:this
        })
    }

    initLoad(){
        const file = document.querySelector("#_galUpFile_")
        file['click']()
    }

    async mkFolder(el){
        const ncarpet = (el.previousElementSibling.value).trim()
        if (ncarpet == "") alert ("Se requiere un nombre para la carpeta")
        else{
            const data = await this.rest.post("/Galeria", {
                ruta: this.limpiarTexto(this.ruta +"/" + ncarpet),
                website_id: this.website_id 
            })
            this.openFolder({innerHTML:""})
            el.previousElementSibling.value=""
        }
    }

    galleryResp(el, acc, bin){
        if (acc === "abrir") {
            const item = el.querySelector(".sel");
            if (item) {
                // Obtenemos el nombre del contenido del primer hijo texto (antes del span x)
                let nombreArchivo = (item.childNodes[0]?.nodeValue || "").trim();
                bin.tag.value = `assets/web${bin.website_id}${bin.ruta}/${nombreArchivo}`;
                bin.tag.setAttribute("ruta", bin.ruta);
                console.log(bin.ruta);
            }
        }
    }

    renderData(data){
        if (data.error != '') alert(data.error)
        else{
            const res= data.res.map(item=>{
                if (item.tipo=="directorio"){
                    return <i class="icon-folder-open-1" onClick={(e)=>this.openFolder(e.target)}>{item.nombre}</i>
                }else{
                    return <i class="icon-doc" onClick={(e)=>this.selFile(e.target)}>{item.nombre} <span onClick={(e)=>this.borrar(e.target) }>x</span></i>
                }
            })

            if (this.ruta != "") res.unshift(<i class="icon-left-open" onClick={(e)=>this.outFolder(e.target)}>Regresar</i>)
            return res
        }
    }

    async borrar(el){
        const file = el.parentNode.innerText
        const nombre = file.substring(0,file.length-1)
        await this.rest.delete(`/Galeria?website_id=${this.website_id}&ruta=${this.ruta}/${nombre}`)
        this.openFolder({innerHTML:""})
    }

    selFile(el){
        const contenedor = el.parentNode

        const prev = contenedor.querySelector(".sel")
        if (prev) prev.classList.remove("sel")
        el.classList.add("sel")
    }

    async openFolder(el){
        const cont:any = document.querySelector("#_galContent_")
        cont.innerHTML =""
        if (el.innerHTML != "") this.ruta+="/"+el.innerHTML
        //if (this.ruta != "") cont.append(<i class="icon-left-open" onClick={(e)=>this.outFolder(e.target)}>Regresar</i>)

        const data = await this.rest.get(`/Galeria?website_id=${this.website_id}&ruta=${this.ruta}`)
        cont.append(... this.renderData(data))

    }

    async outFolder(el){
        el.innerHTML=""
        const p = this.ruta.split("/")
        p.pop()
        this.ruta=p.join("/")
        console.log(this.ruta)
        this.openFolder(el)
    }
}