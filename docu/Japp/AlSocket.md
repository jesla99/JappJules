[< Regresar](Indice.md)

---
# Evento al Socket
Entre una de las caracteristicas de los eventos de Japp-N mas interesantes, esta el evento alSocket, este evento es lanzado por Japp-N cuendo se recibe comunicación por el socket, para mas información de sockets, ver [Sockets](Sockets.md).

## Definir módulo de escucha
Para la versión del 25 de febrero del 2025, la recepción de comunicación por sockets es recibida por Japp-N y puede ser enviada a un módulo en particular, por lo que es necesario indicarle a socket qué módulo que recibirá dicha comunicación; esta acción se realiza de la siguiente manera

```js
    socket.setModulo( this )
```
Este linea define que el módulo actual (this), será el módulo que recibirá la comunicación del socket, por lo que solamente el evento alSocket del modulo actual, recibirá el mensaje del socket. Se espera que a futuras versiones la rececpción del socket pueda ser enviado en un broadcast a el o los árboles de módulos que Japp-N posea.


### Eventos de alSocket
Este evento recibe como argumentos:

- **Mensaje**: Contiene el mensaje de cualquier tipo, este mensaje es recibido desde una instancia de Japp remota.  
- **data**: Contiene un objeto con información del origen del mensaje, inicialmente posee los siguientes datos: 
    - *socket_id*: Devuelve el ID del socket remoto.
    - *socket_tipo*: Indica el tipo de socket.
    - *dato_tipo*: cadena de texto que indica el tipo de dato que Japp-N infiere que es recibido. 


Ejemplos: 

```js
    import React from './libs/MiReact.js'

    class MiModulo{
        alCargar ( props, contenido ){
            //aqui se escribe el código del evento al Carggar
            ...
            return <div>Este es el resultado devuelto para agregar al DOM</div>
        }

        alSocket (mensaje:any, data){
            console.log("Mensaje recibido desde el server: ", mensaje)
        }
    }

    export default MiModulo
```

Nota: 
Este ejemplo asume que existen dos instancias de Japp-N corriendo en equipos diferentes y están correctamente configurados para utilizar sockets.

En el ejemplo, el evento alSocket, recibe dos argumentos, un mensaje y un objeto; el mensaje es de tipo any y puede recibir una cadena, un número, un arreglo un json, etc. El segundovalor "data", recibe un json con especificaciones del mensaje, especificaciones como: nombre del socket que esta enviando la información, tipo de socket entre otros valores que para el momento de redactar este documento, aún no están definidos.


NOTA IMPORTANTE: Este evento y la funcionalidad de sockets estan en una versión BETA, fueron desarrollados el 23 de febrero del 2025.

*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)