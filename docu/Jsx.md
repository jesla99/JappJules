[< Regresar](README.md)

# JSX
Debido a que JappN es un framework basado en javascript por medio de NodeJs, por lo que, la creación de los elementos html a mostrar son creados por javascript de la siguiente manera:

``` js
    const div = document.createElement("DIV")
    div.innerHTML = "Contenido del DIV"

    const boton =  document.createElement("BUTTON")
    boton.value = "Aceptar"
    boton.onclick = function (event){
        alert ("Mensaje de saludo")
    }

    div.append( boton )
```

Este ejemplo genera un div con un mensaje y un boton adentro en javascript puro, ahora veremos un ejemplo de como crear lo mismo pero en JSX

```tsx
    const div = <div>
        Contenido del DIV
        <button onCcick="alert('Mensaje de saludo')"></button>
    </div>
```

Como se puede observar, JSX permite incluir juntamente con javascript una sintaxis exageradamente similar a HTML, simplificando, ordenando y agilizando el desarrollo. 

Para ello es necesario contar con una libreria que interprete la sintaxis de tags y las transcriba a javascript; esta libreria es React.

Rest es una libreria creada por Meta (r), pero jappn **NO** utiliza la libreria de Meta (r), en su defecto se programó desde cero, una libreria mínima que cumple con la funcionalidad descrita.

### Uso dentro de JappN

Dentro de un módulo de funcion de JappN, como norma del framework y como buena práctica, en un 99% de los casos es necesario que la librería React sea agregada como la primera línea de la siguiente manera:


Mimodulo.tsx
```js
    import React from '../libs/MiReact.js'

    function Mimodulo(props){
        //regresamos un jsx
        return <h1>Hola Mundo</h1>
    }

    export defautl Mimodulo
```

nota: en el ejemplo anterior, el retorno de la función es un objeto jsx que daría un error si la linea de importa React no estuviera incluída

## Propiedades dentro de un JSX
Los elementos HTML poseen la posibiludad de contar con propiedades y la forma de utilizarlas es la misma en JSX, con el agregado de poder colocar variables de javascript, pero para ello la variable deberá estar encerrada dentro de llaves {}

ejemplos:

```js
    // propiedades constantes
    <div class="panel" title="nombre del usuario"> contenido </div>

    // propiedades variables
    const varClase = "panel"
    const varTitle = "El titulo para tool tip"

    <div class={varClase} title={varTitle}> contenido </div>
```

## Eventos dentro de un JSX
Al igual que las propiedades, los elementos jsx pueden tener eventos o acciones y depende de su escritura poseerán un ambito diferente, de la siguiente manera:

### Evento de documento
Un evento de documento, es aquel evento que se ejecuta directamente sobre el DOM (elementos en pantalla) no teniendo acceso a las fucionalidades del módulo, en el caso de ser un módulo de clase o módulo de jappn.

Ejemplo:

Objeto JSX
```js

    <button onclick="console.log(this)">Clic</button>

```

Como se observa en el ejemplo, el evento **onclick** (todo en minuscula) permite mostrar en consola la referencia local, al momento de dar click sobre el botón.

Al ejecutar, podremos observar que en la consola se visualizará el elemento HTML button, esto se debe a que console.log(this) se refiere a el mismo objeto, eso quiere decir que el ambito es el mismo elemento HTML.

### Evento de framework
Un evento de framework, es aquel que se escribe en formato cammelCase, utilizando mayúscula como identificador de cambio de palabra, cambiando onclick por onClick.

Ejemplo:

Objeto JSX
```js

    <button onClick={()=>console.log(this)} >Clic</button>

```

Como se observa la escritura del evento no solo difiere en el uso de camelCase, también cambia en el sentido de que el valor del evento debe ser una función y por ende, la ser javascript debe ser escrito dentro de llaves {}, y en este caso está escrito en una función de flecha.


*[Jesus E. Laynes G.]*


[< Regresar](README.md)