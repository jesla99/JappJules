[< Regresar](Indice.md)
---
# VAcordion
La extensión VAcordion, tiene como funcionalidad fabricar un Acordión para organizar y presentar información de forma ordenada aprovechando al máximo el espacio disponible en pantalla. El uso de esta extensión requiere además de su invocación, algunas especificaciones extra que se definen a continuación.

### Elementos requeridos
* Contenedor principal:

Este contenedor debe ser un elemento html del tipo DIV, y es aquí en donde se aplica la extensión incluyendo dentro de la class de css el siguiente valor:

ejemplo:
```js 
    ...
    return <div class="jsx_VAcordion" > ...
    ...
```

Nota: un elemento definido como jsx_VAcordion, tiene un ancho y alto de 100px respectivamente, por lo que es importante que al momento de crear el elemento, se le asigne el alto y ancho adecuado por medio de estilos css.

Con esta declaración, el elemento DIV será el lugar en donde trabajara la extensión. Ahora bien, además se requiere contar con una estructura básica del contenido de este element, que en este caso son cada uno de los items del acordión vertical o VAcordioan; estos items son contenedores o elementos DIV en los cuales debe ir la información que será agrupada y mostrada. Para mejor comprensión se comparte el siguiente ejemplo:

```js
    ...
        return <div class="jsx_VAcordion">
            <div nombre="Productos">
                Aquí debe ir la información sobre productos, puede ser texto o mas elementos HTML
            </div>
            <div nombre="Clientes">
                En este apartado debería ir la información o elementos html que tienen que ver con clientes
            </div>
            <div nombre="Ventas">
                Dentro de cada item pueden haber incluso módulos como por ejemplo:

                <FromClientes />
            </div>
            <div nombre="Notificaciones" class="sel">
                <Notificacion />
            </div>
        </div>

```

Como se aprecia en el ejemplo anterior, cada DIV tipo item del elemento marcado como contenedor principal, tiene una propiedad **nombre**, esta propiedad es utilziada para definir el nombre del item y que será empleado para identificar a cada item de forma grafica. 
Es importante resaltar que el ultimo item, ademas de posee la propiedad nombre, también tiene una clase de css llamada **sel**, esta indica que este item será el item que aparecerá abierto por defecto y todos los demás aparecerán cerrados.

Nota: Según el espacio disponible y si fuera necesario, mas de un item puede estar visible a momento de cargar el acordión, pero al momento de dar clic sobre algun titulo de item, todos los items abiertos serán cerrados, dejando abierto únicamente el item al que se procedió a dar clic.


*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)