[< Regresar](Indice.md)

---
# Evento al Recibir
Japp posee varios eventos, algunos de ellos son obligatorios y otros opcionales, el evento alRecibir es un evento opcional, este evento se ejecuta cuando se desea que el elemento pueda ser invocado por la acción de jappn [**enviar**](Enviar.md), que es una funcinalidad creada para compartir mensajes entre módulos.

Este evento recibe un solo argumento, este es un mensaje del tipo infMensaje que se describe en la seccion de interfaces:


Ejemplos: 

```js
    import React from './libs/MiReact.js'

    class MiModulo{
        alCargar ( props, contenido ){
            //aqui se escribe el código del evento al Carggar
            ...

            return <div>Este es el resultado devuelto para agregar al DOM</div>
        }

        alRecibir ( mensaje ){
            console.log(mensaje)
        } 
    }

    export default MiModulo
```

Nota 1: 
El evento alCargado a diferencia del evento alCargar que si devuelve un valor, alCargado no devuelve ningún valor y aunque posea la instrucción return, esta instrucción no tendrá ningún efecto.

Nota 2:  
Este evento se programó pensando en aplicar cambios a los elementos renderizados, posteriormente a ser creados en el DOM, por ejemplo, agregar información recibida del servidor, después de haber renderizado los elementos en pantalla.

*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)