[< Regresar](README.md)

---
# Función React
Japp es un framework hecho 100% en javascript, por tal razón crear elementos HTML directamente en javascript es un proceso un poco tedioso y complicado, que dificulta el mantenimiento de interfaces gráficas.

Para resolver este inconveniente existe una librería que permite facilitar esta acción, habilitando la posibilidad de utilizar la sintaxis del Lenguaje de marcado de mensajes de hipertexto (HTML) dentro de javascript.

Para su mejor comprensión recomendamos leer [Qué es Jsx](Jsx.md).

Japp está configurado para utilizar la función React, pero para ello se requiere que en el módulo en donde emplearemos JSX, esté importada la libreria MiReact (una implementación de las funcionalidades básicas de React), esta librería esta programada desde cero para JappN y esta diseñada exclusivamente para JappN.

### Forma de incluir React en mi módulo

módulo de función 
```js
    import React from '../libs/MiReact.js'
    
    function MiModulo( props ){
        return <h1>Hola mundo</h1>  //esta linea provoca un error si la libreria React No esta importada
    }

    export default MiModulo
```

## Funciones React
Las funciones React, son aquellas funciones que pueden ejecutarse desde la librería React, estas ejecutan funciones que NO necesariamente dependen de un modulo de clase o un módulo JappN, algunas de estas funciones son:

### React.Cargar



## Extensiones JSX
Desde la versión de jappn 1.2.0, la función React posee la opción de tener extensiones al momento de renderizar un jsx.

Las extenssiones de jsx estan instaladas en /src/libs/react_exts y en /src/js/vistas/bin/exts, de tal manera que las extensiones serán buscadas primeramente en la carpeta /js/vistas/bin/exts y de no existir una extensión que responda, buscará en la carpeta /libs/react_exts

### Forma de uso de las extensiones JSX
Para utilizar una extensión jsx en un elemento, se requiere agregar dentro de la propiedad class del elemento, el nombre de la extensión con el prefijo jsx_ por ejemplo:

```js

function MiModulo(props){
    return <div>
        <h1 class="jsx_Colap">Alumnos</h1>
        <div>
            alumno 1<br />
            alumno 2<br />
            alumno 3<br />
            alumno 4<br />
            alumno 5<br />
            alumno 6<br />
            alumno 7<br />
        </div>

    </div>
}

```

En este ejemplo, el elemento h1 será afectado por la extensión colap, si esa extensión esta instalada en el framework, la extensión colap permite que el elemento marcado como colap permita ocultar y mostrar el siguiente elemento o siguiente elemento hermano.

### Listado de extensiones JSX en jappn 1.2.0
Desde la version de jappn 1.2.0 JSX al renderizar un elemento, tiene la capacidad de aplicar funcionalidades a los elementos HTML por medio de extensiones, se presenta un listado de extensiones como parte informativa, para mas detalle revisa la documentación de extensiones JSX [Aquí](extJsx/Indice.md)

* **Colap**: Activa la opción de colapsar y descolapsar (ocultar/mostrar) el elemento hermano del elemento al que se le aplica la extensión; con la acción de clic sobre el elemento al que se aplica la extensiôn.

* **VAcordion**: Acordion vertical para agrupación de información

* **Ledit**: 


*[Jesus E. Laynes G.]*

---
[< Regresar](README.md)