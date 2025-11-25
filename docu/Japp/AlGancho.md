[< Regresar](Indice.md)
---
# al Gancho
JappM posee una capa se seguridad que evita el acceso externo al código interno, pero mediante la definición de hilos (ver extensión [Ganchos](../extJsx/Gancho.md)), es posible permitir que un proceso externo a japp pueda solicitar la ejecución de un proceso interno. Esta solicitud será recibida solamente si el módulo posee definido el evento alGancho. 

El evento alGancho puede recibir parámetros al momento de ser invocado, pero NO puede recibir una respuesta, esto como medio de seguridad, para evitar que pueda devolverse alguna referencia a algun contexto interno.

Ejemplo:

```js
    import React from './libs/MiReact.js'

    class MiModulo{
        alCargar ( props, contenido ){
            //aqui se escribe el código del evento al Carggar
            ...

            return <div>Este es el resultado devuelto para agregar al DOM</div>
        }

        alGancho ( obj ){
            console.log( obj )
        } 
    }

    export default MiModulo
```

**Nota**: El objeto recibido es de tipo variante, es decir que puede ser una cadena, un numero, un objeto Json o incluso un elemento HTML.

*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)