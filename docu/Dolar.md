[< Regresar](README.md)

---

# Función $
La clase dolar ($) es una función que permite trabajar de forma mas cómoda con elementos en pantalla, es una implementación desde cero de las funcionalidades mas básicas de JQuery (r), aunque es importante mencionar que no es la biblioteca de JQuery (r) y que no es compatible con plugins o extensiones de JQuery (r).

Esta función esta construida de forma automática dentro de los módulos jappn y es accesible por medio de this.$ por lo que no es necesario importarla, instanciarla o declararla para usarla.

Si el módulo en donde se desea emplear la función dolar ($) no es un módulo jappn, entonces si es necesario importar la funcionalidad de la siguiente manera.

Uso de Funcion dolar en un módulo de función
```js
import $ from '../libs/$.js'

function MiModulo( props ){
    //obtiene en la variable mensaje el contenido de el elemento HTML con ID miElemento
    const mensaje = $("#miElemento").val()
    return <h1>{mensaje}</h1>
}

export default MiModulo
```

Uso de Funcion dolar en un módulo de clase
```js
import $ from '../libs/$.js'

class MiModulo{
    alCargar( props ){
        //obtiene en la variable mensaje el contenido de el elemento HTML con ID miElemento
        const mensaje = $("#miElemento").val()
        return return <h1>{mensaje}</h1>
    }
}

export default MiModulo
```


Uso de Funcion dolar en un módulo JappN
```js
import $ from '../libs/$.js'

class MiModulo{
    alCargar extends JappN{
        //obtiene en la variable mensaje el contenido de el elemento HTML con ID miElemento
        const mensaje = this.$("#miElemento").val()
        return return <h1>{mensaje}</h1>
    }
}

export default MiModulo
```


*[Jesus E. Laynes G.]*

---
[< Regresar](README.md)