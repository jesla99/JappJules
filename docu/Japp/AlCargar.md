[< Regresar](Indice.md)

---
# Evento al Cargar
Japp posee varios eventos, pero uno de los mas importantes es el evento alCargar, ya que este evento es obligatorio ya que, este evento es el que JappN busca para obtener el resultado del módulo y mostrarlo en pantalla.

Lo mas importante de este evento, es entender que todo lo que aquí se ejecute se estará ejecutando antes de que los elementos seran agregados al DOM, es decir, que sean elementos HTML accedibles por el navegador.

El evento alCargar puede recibir 2 argumentos; propiedades y contenido:

- Las propiedades son enviadas al momento te invocar el módulo, en el caso hipotético del módulo MiModulo, <MiModulo prop1="valor 1" prop2="valor 2">, en donde prop1 y prop2 serian los parametros recibidos por el módulo, con la diferencia de que, dentro de modulo, la variable props traería agrupadas las propiedaeas de la siguiente manera:

```js
    props = {
        prop1: "valor 1",
        prop2: "valor 2"
    }

```

- El contenido, que en el caso de ser un componente que posee modulos o elementos HTML como hijos, estos se reciben opcionalmente como un array con los datos internos, en el caso hipotético de MiModulo:


<MiModulo prop1="valor 1" prop2="valor 2">
    <div>linea 1</div>
    <div>linea 2</div>
    <div>linea 3</div>
    <div>linea 4</div>
    <div>linea 5</div>
</MiModulo>

En donde en el evento alCargar se recibiría de la siguiente manera
```js
    contenido = [
        <div>linea 1</div>,
        <div>linea 2</div>,
        <div>linea 3</div>,
        <div>linea 4</div>,
        <div>linea 5</div>
    ]

```


Ejemplos del evento alCargar: 

```js
    import React from './libs/MiReact.js'

    class MiModulo{
        alCargar ( props, contenido ){
            //aqui se escribe el código del evento al Carggar
            ...

            return <div>Este es el resultado devuelto para agregar al DOM</div>
        }
    }

    export default MiModulo
```

Nota 1: 
El evento alCargar solo está disponible en un módulo de clase y módulos JappN.

Nota 2: 
El contenido puede no ser necesario, salvo casos muy puntuales en donde se requiere procesar los elementos de un módulo, como por ejemplo la creación de un módulo de tools.

*[Jesus E. Laynes G.]*

---
[< Regresar](Indice.md)