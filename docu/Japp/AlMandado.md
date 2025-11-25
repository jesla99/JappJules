[< Regresar](Indice.md)

---
# Evento al Mandado
Japp posee varios eventos, algunos de ellos son obligatorios y otros opcionales, el evento alMandado es un evento opcional, este evento forma parte de los eventos que se desencadenan al usar la función [**enviar**](Enviar.md), función que envía mensajes entre módulos.

El flujo de un mensaje entre módulos es el siguiente:

1. Módulo emisor emite un mensaje por medio de this.enviar
2. Uno o varios módulos destino reciben el mensaje en evento alRecibir (alRecibir del módulo destino)
3. El módulo emisor recibe una confirmación de finalización de entrega en el evento alMandado, una llamada por cada módulo destino.

Este evento alMandado, recibe 3 argumentos:
- El mensaje entregado. 
- Una confirmación de mensaje satisfactorio. 
- Una confirmación grupal de mensajes satosfactorios. 


Ejemplos: 

Módulo Emisor del mensaje: 

```js
    import React from './libs/MiReact.js'

    class MiModulo{
        alCargar ( props, contenido ){
            //aqui se escribe el código del evento al Carggar
            ...
            //Enviando un mensaje a todos los componentes que tenga el evento alRecibir
            this.enviar({mensaje:"Nuevo plugin instalado."})
            return <div>Este es el resultado devuelto para agregar al DOM</div>
        }

        //Este evento se ejecutará cada vez que un móduro destino logré recibir el mensaje. 
        alMandado ( mensaje, ok, globalOk ){
            console.log(mensaje, oj, globalOk)
        } 
    }

    export default MiModulo
```

Módulo receptor: 
```js
    import React from './libs/MiReact.js'

    class OtroModulo{
        alCargar ( props, contenido ){
            //aqui se escribe el código del evento al Carggar
            ...
            this.enviar({mensaje:"Nuevo plugin instalado."})
            return <div>Otro modulo cargado por JappN</div>
        }

        alRecibir ( mensaje ){
            console.log(mensaje)
        } 
    }

    export default OtroModulo
```

Nota 1: Que las propiedaes mensaje, ok y globalOk del evento alMandado devuelvan falso o verdadero, dependerá de la configuración que posea el mismo mensaje, específicamente la propiedad de confirmacion del mensaje.


*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)