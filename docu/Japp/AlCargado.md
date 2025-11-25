[< Regresar](Indice.md)

---
# Evento al Cargado
Japp posee varios eventos, algunos de ellos son obligatorios y otros opcionales, el evento alCargado es un evento opcional, este evento se ejecuta inmediatamente después que los elementos devueltos por el evento alCargar son agregados al DOM del navegador.

Este evento recibe como argumentos:

- **Elemento**: Devuelve el elemento que se renderizó desde el evento alCargar.  
- **Propiedades**: Devuelve un objeto con las propiedades con las que se invocó el módulo.  
- **Contenido**: Devuelve un arreglo con el contenido del tag jsx con el que se invoca el módulo. 


Ejemplos: 

```js
    import React from './libs/MiReact.js'

    class MiModulo{
        alCargar ( props, contenido ){
            //aqui se escribe el código del evento al Carggar
            ...

            return <div>Este es el resultado devuelto para agregar al DOM</div>
        }

        alCargado ( element, props, contenido ){

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