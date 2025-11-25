[< Regresar](Indice.md)

---
# Enviar
Funcion de JappN que se encarga de establecer comunicación segura entre componentes, para ello se requiere la siguiente estructura de datos:

```ts
    interface infMensaje{
        //nombre del componente destino, vacio o inexistente = * (todos los elementos, se ejecuta propagacion 4 broadcast)
        destino?:string
        //cualquier mensaje, elemento html, cadena u objeto json
        mensaje:any
        //indica si requiere confirmación de ejecución
        confirmar?:boolean
        //direccion de la propagación 0 o inexistnte solo el destino, 1 hacia adelante de la rama, 2 hacia el tronco, 3 hacia la rama y el tronco y 4 broadcast
        propagacion?:number
    }
```

## Destino
El destino es el módulo que recibirá la comunicación directamente en el evento [**alRecibir**](AlRecibir.md), se puede acceder a un módulo por medio de: 

- **id**: Hace refencia aun módulo con identificador único 

- **nombre**: Hace referncia a todos los módulos que fueron construidos a partir de la misma clase de jappn

- **(*)**: Un asterisco hace referencia a todos los elementos

- **(ignorado)**: esta propiedad es opcional, si se omite o ignora, el mensaje será enviado a todos los elementos de la rama.

Nota: La validación de destino se ve afectada por el tipo de propagación del mensaje.

## mensaje
Esta propiedad es obligatoria y dentro de ella enviarse cualquier tipo de dato o estructura.

## confirmacion
Propiedad opcional de tipo boleana, indica si el envío requiere o no, confirmación de recepción, en caso de no poder entregarse un mensaje y que la confirmación este activa, la llamada devolverá false. en caso contrario true. 

## Propagacion
La propagación indica como fluirá el mensaje dentro del arbol de módulos, el árbol es es como un DOM virtual de módulos.

Posibles valores:
0. El mensaje no se propaga, es decir que cuando encuentra un elemento que cumple con las especificaciones, el mensaje deja de replicarse a otros modulos.

1. El mensaje se propaga a toda la rama o nodos hijos que se encuentren despues del módulo que cumple con las condiciones de entrega del mensaje.

2. el mensaje se propaga hacia el tronco o raíz, pasando solo por los nodos padres de forma ascendente a partir del nodo que cumple con las condiciones de aceptar el mensaje.

3. el mensaje se propaga hacia la rama del elemento que cumple con las condiciones para recibir el mensaje y hacia el tronco pasando solo por los padres de forma ascendente.

4. el mensaje se propaga a TODO el arbol al que pertenece el nodo que cumple con las condiciones para entrega de mensajes.

### Ejemplo de envío de mensajes: 

Modulo Emisor
```js
    import React from '../libs/MiReact.js'
    import JappN from '../libs/JappN.js'
    import {infMensaje} from '../interfaces/jappn.js'  //opcional para garantizar variable de envio

    export default class Emisor extends JappN{
        alCargar(props){
            return <h1>Hola </h1>
        }

        alCargado(el props){
            const mensaje:infMensaje ={
                destino:'Receptor',
                mensaje:'Hola soy el emisor',
                propagacion: 4
            }
            this.enviar(mensaje)
        }
    }
```

Modulo Receptor
```js
    import React from '../libs/MiReact.js'
    import JappN from '../libs/JappN.js'

    export default class Receptor extends JappN{
        alCargar(props){
            return <h1>como te va? </h1>
        }

        alRecibir(data){
            console.log(data)  //aqui se recibe la informacion enviada desde el emisor
        }
    }
```

*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)