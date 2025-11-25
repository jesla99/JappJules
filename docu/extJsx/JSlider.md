[< Regresar](Indice.md)
---

# JSlider (Extensión Jsx)
Extensión de jsx que fabrica un contenedor que permite deslizar su contenido de izquierda a derecha.

Ejemplo:

```js
    alCargar(props){
        return <div>
            <h3>Mis opciones</h3>
            <div class="jsx_JSlider">
                <img src="js/vistas/bin/preload.gif">
                <img src="js/vistas/bin/preload.gif">
                <img src="js/vistas/bin/preload.gif">
                <img src="js/vistas/bin/preload.gif">
            </div>
        </div>
    }

```

Como se aprecia en el ejemplo, el uso de esta extensión es sumamente sencillo y práctico; es solamente un contenedor div con la clase de css jsx_JSlider y dentro de el cada uno de los elementos HTML que serán parte del Slider.

nota: El uso no se limita a imágines, aplica a cualquier elemento HTML como divs, botones, imagenes, otros Módulos, etc.

nota 2: Los elementos internos del JSlider, pueden tener si se desea, un evento click para crear un poco mas de interactividad.

nota importante: Si se desea colocar un módulo como item de JSlider, es necesario que el módulo sea cargado dentro de un contenedor div, ekemplo:

```js
    alCargar(props){
        return <div class="jsx_JSlider">
            <img src="js/vistas/bin/preload.gif" />
            <div> Algun otro contenido </div>
            <div> 
                <div class="jsx_VAcordion">
                    <div nombre="seccion 1"></div>
                    <div nombre="seccion 2"></div>
                    <div nombre="seccion 3"></div>             
                </div>
            </div>
        </div>
    }

```
nota: El tercer elemento del JSlicer es un jsx_VAlign, pero este este contenido dentro de un elemento div, esto evita que los estilos de cada una de las extensiones o módelos entren en conflicto.


*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)