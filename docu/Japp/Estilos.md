[< Regresar](Indice.md)

---
# Estilos css
Actualmente existen varias formas de incluir estilos a mi aplicación creada con JappN, cada una con su ventajas y/o complicaciones, la cuales se describen a continuación.

## Archivo app.css
Este es un archivo css común y corriente que será cargado al inicio de la ejecución de la aplicación, este archivo se sobre pone al archivo principal del framework.

El archivo app.css se encuentra en js/vistas/bin/app.css


## Propiedad _estilo
En el caso de módulos jappn, existe la posibilidad de incluir estilos css directamente en la clase, por medio de la propiedad _estilo; esto garantiza que el estilo será cargado únicamente cuando la vista sea cargada al DOM y descargado cuando el elemento renderizado deje de existir en el DOM.

Ejemplo:

```js
    export default class extends JappN{
        _estilo={
            ".titulo":[
                "text-align: center",
                "margin-top: 50px"
            ],
            "*":[
                "color: blue"
            ]
        }

        alCargar(props){
            ... mas código ...
        }
    }
```
En este ejemplo el estilo es construido al cargar el módulo y es eliminado cuando el módulo es eliminado del DOM. 

El inconveniente que tiene tanto el archivo app.css como la propiedad _estilo de las clases JappN, es que, al aplicar el estilo afectan a cualquier elemento del navegador que coincida con la regla css definida, en el ejemplo, cualquier elemento con la clase .titulo será afectado, no importando si fué o no construido por el módulo JappN actual.

Para poder solucionar el tema del ambito o contexto del estilo, la propiedad _estilo puede apoyarse de la propiedad experimental VID (View ID) de las clases JappN, que permiten identificar a cada view (vista = módulo) con un número interno único. El VID puede aportar una capa de segmentación del estilo y permitir que aplique únicamente a los elementos construidos por el módulo JappN actual.

ejemplo:

```js
    export default class Mimodulo extends JappN{
        useVID=true
        _estilo={
            ".titulo":[
                "text-align: center",
                "margin-top: 50px"
            ],
            "*":[
                "color: blue"
            ]
        }

        alCargar(props){
            ... mas código ...
        }
    }
```
Con useVID = true, la regla de estilo .titulo, únicamente se aplicará a los elementos que estén contenidos dentro del módulo JappN que los fabricó, ignorando a todos los elementos que No fueron creados por él.

## Propiedad jcss
Como pudimos observar, la propiedad _estilo utiliza una sintaxis diferente al lenguaje de estilos estandar, por lo que para simplificar la integración de hojas de estilo, la propiedad jcss de miReact, permite compartir una referencia a un archivo de estilos .css esterno, que será cargado al construir el módulo y descargado al eliminar los elementos del DOM que generó el módulo.

Es importante mencionar que, esta propiedad se procesa a nivel de jsx, por lo que NO es dependiente de la clase JappN, además, los estilos agregados con jcss aplican únicamente a los elementos creados por el módulo, ya sea un módulo de funcion, módulo de clase o módulo de clase JappN.

Ejemplo:

```js
    export default ()=>{
        return <div jcss="mi_estilo.css">
            <h1>Mi titulo</h1>
            <p> este es mi parrafo </p>
        </div>
    }
    
```
El ejemplo anterior como se puede observar es más limpio, ordenado y cumple con la buena práctica de tener los estilos en un archivo por separado y aplicando los estilos únicamente a los elementos construidos por el módulo actual.

Nota: Los archivos de estilo .css tienen como ruta base js/vistas/bin
 


---
[< Regresar](Indice.md)
