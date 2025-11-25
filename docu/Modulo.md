[< Regresar](README.md)
---
# Modulo
JappN emplea una programación modular, por lo que es necesario entender las diferentes formas de programar un módulo.

Como concepto, un módulo tiene como finalidad enfocarse en una actividad puntual, convirtiendose en un proceso con entrada, proceso y salida.

## Tipos de módulos
JappN reconoce 3 tipos de módulos, cada uno de estos tiene variantes en su funcionamiento que se describen a continuacion.

### Modulo de funcion
Un componente de función, tiene como finalidad recibir parámatros opcionales, ejecutar un proceso y devolver una respuesta que puede ser un string o un elemento html. Este tipo de componente solamente permite un proceso y no adminte mas funcionalidades dentro de él.

Mimodulo.tsx
```tsx
    import React form '../libs/MiReact.js'   //importamos la libreria para jsx

    //definicion del modulo
    function Mimodulo(props){
        return <h1>Hola mundo</h1>
    }    

    //exporta el modulo como elemento por defecto
    export default Mimodulo
```

### Modulo de clase
Un componente de clase permite contar con mas de una funcionalidad, esto permite tener un componente con entrada, proceso y salida; pero en su definición puede disponer de mas funcionalidades encapsuladas dentro del mismo componente y que pueden ser invocadas en tiempo de ejecución.

Mimodulo.tsx
```tsx
    import React form '../libs/MiReact.js'   //importamos la libreria para jsx

    class Mimodulo{
        alCargar(props){
            return <button onClick={()=>this.saludo()}>Saludar</button>
        }

        saludo(){
            alert ('Hola este es un saludo')
        }
    }

    export default Mimodulo
```

nota 1: Un módulo de clase requiere **obligatoriamente** una función llamada **alCargar**, ya que esta es la clase que JappN busca como función principal de módulo.

nota 2: La función **saludo**, como se puede observar, es una función extra que puede ser ejecutada al dar click sobre el boton que se renderiza en la función principal y ya en tiempo de ejecución


## Modulo de JappN
Un módulo de JappN, posee mucha mas lógica y funcinamiento ya que es heredado de la clase del propio JappN.


Mimodulo.tsx
```tsx
    import React from '../libs/MiReact.js'   //importamos la libreria para jsx
    import JappN from '../libs/JappN.js'   //importamos jappn IMPORANTE
    

    class Mimodulo extends JappN{
        //funcion principal de carga del módulo
        alCargar(props){
            return <div>
                <div id="monitor"></div>
                <button onClick={()=>this.saludo()}>Saludar</button>
            </div>
        }

        //función que se ejecuta posteriormente a la carga del elemento de respuesta del módulo
        alCargado(element, props){
            //uso de this.$ (una función de jappn)
            const monitor = this.$("#monitor")[0]
            monitor.innerHTML = "Texto a agregar al div con ID monitor"
        }

        saludo(){
            alert ('Hola este es un saludo')
        }
    }

    export default Mimodulo
```

nota 1: En el caso de un módulo jappn, cuando la clase se extiende desde jappn, el módulo nuevo recibe acceso a las funcionalidades de jappn, como en este caso this.$

nota 2: Una módulo jappn debido a contar con muchas funcionalidades, puede llegar a consumir levemente un poco mas de memoria, por lo que si el módulo que se requiere posee un proceso simple, se recomienda evaluar el uso de módulos de función o modulos de clase.

nota 3: Un módulo jappn, podee dentro de si mismo referencia al módulo padre (En el caso de que el módulo haya sido instanciado dede otro módulo) y  módulos hijos (todos aquellos módulos que fueron instanciados desde el módulo actual).

## Usar un Módulo
Cuando un módulo ya está listo, puedes hacer uso de ellos tomando en cuenta 2 aspectos importantes:

En el ejemplo se utiliza un módulo llamado Inicio.tsx y un módulo segundario llamado FichaCliente.tsx que será insertado en Inicio.

Inicio.tsx
```js
    import React from '../libs.MiReact.js'
    import FichaCliente from './FichaCliente.js'

    function Inicio( props ){
        return <div>
            <h1>Ejemplo</h1>
            <FichaCliente />
        </div>
    }

    export default Inicio
```

En este ejemplo se demuestra como el módulo FichaCliente será insertado tal cual fuera un tag propio de HTML, pero realmente estamos utilizando un módulo de función.

## Propiedades del Módulo
Como ya hemos visto en puntos anteriores, un módulo dentro de jappn se utiliza tal cual fuera un elemento html, es por tal razón que las propiedades del módulo deben se enviadas de la misma manera que las propiedades de un elemento HTML.

```js
    ...
    <div>
        <h1>Ejemplo</h1>
        <FichaCliente cliente_id="8" />
    </div>
    ...
```

En el ejemplo anterior se envía la propiedad cliente_id con el valor 8, es importante aclarar que las propiedades son recibidas como argumentos dentro del módulo.

Recordemos que aunque jsx parezca ser html, es una sintaxis de escritura que como parte del proyecto puede recibir variables, en el siguiente ejemplo encontrarás como enviar la variable ID como id de cliente.

```js
 ...
    <div>
        <h1>Ejemplo</h1>
        <FichaCliente cliente_id={ID} />
    </div>
    ...
```

De esa manera, la propiedad cliente_id tendrá como valor el valor que la variable ID posea; nota que ID esta encerrada dentro de {}, ya que esa es la manera que JSX sabe que ID no es un texto y por el contrario al encontrar las llaves {}, entinde que es un trozo de javascript.

## Salida del Módulo
Todo  módulo tiene como finalidad devolver información para ser reporesentada de forma visual. Un modulo pude devolver varios tipos de resultados:

### Cadena de texto
Una cadena de texto simple.

```js
    ...
    class Inicio{
        alCargar(props){
            return 'hola'  //retorna una cadena
        }
    }
    ...
```


### Elemento HTML (jsx)
```js
    ...
    class Inicio{
        alCargar(props){
            return <h1>hola</h1>  //retorna un elemento HTML
        }
    }
    ...
```

### Array de textos y/o Elementos HTML

```js
    ...
    class Inicio{
        alCargar(props){
            return [<h1>hola</h1>,<h3>como estas</h3>]  //retorna un array
        }
    }
    ...
```

en el caso de necesitar anexar un segundo array al array principal de retorno, deberá hacerse de la siguiente manera:


```js
    ...
    class Inicio{
        alCargar(props){
            const extra = [<FichaCliente id="8"/>, <FichaCliente id="11" />]

            return [<h1>hola</h1>,<h3>como estas</h3>, ...extra]  //retorna un array
        }
    }
    ...
```


*[Jesus E. Laynes G.]*

[< Regresar](README.md)